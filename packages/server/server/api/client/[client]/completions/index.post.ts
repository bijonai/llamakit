import type { ChatCompletionResponse, ChatRequestBody } from '@llamakit/core'
import type { ClientData } from '../../../../types/api'
import { createChatTransformer } from '@llamakit/core'

export default defineEventHandler(async (event): Promise<ChatCompletionResponse> => {
  const clientId = getRouterParam(event, 'client')
  const body = await readBody<ChatRequestBody>(event)

  if (!clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Client ID is required',
    })
  }

  const storage = useStorage('redis')

  try {
    // 获取client配置
    const clientData = await storage.getItem<ClientData>(`client:${clientId}`)
    if (!clientData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Client not found',
      })
    }

    // 创建ChatTransformer
    const transformer = createChatTransformer({
      apiKey: clientData.apiKey,
      baseUrl: clientData.baseUrl,
    })

    const startTimestamp = new Date()
    const [result, resolve] = transformer(body, { timestamp: startTimestamp })

    // 生成唯一的日志ID
    const logId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // 将初始结果写入本地KV Storage
    const logs = await storage.getItem<any[]>(`client:${clientId}:logs`) || []
    const logEntry = {
      id: logId,
      ...result,
      requestInfo: {
        url: `${clientData.baseUrl}/v1/chat/completions`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientData.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        timestamp: startTimestamp.toISOString(),
      },
    }

    logs.unshift(logEntry) // 最新的放在前面
    await storage.setItem(`client:${clientId}:logs`, logs)

    try {
      // 转发用户请求到AI服务器
      const response = await $fetch<ChatCompletionResponse>(`${clientData.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientData.apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
      })

      // 处理返回结果（异步写入）
      const endTimestamp = new Date()
      const finalResult = resolve(response, { timestamp: endTimestamp })

      // 更新日志条目
      const updatedLogs = await storage.getItem<any[]>(`client:${clientId}:logs`) || []
      const logIndex = updatedLogs.findIndex(log => log.id === logId)
      if (logIndex !== -1) {
        updatedLogs[logIndex] = {
          ...updatedLogs[logIndex],
          ...finalResult,
          responseInfo: {
            status: 200,
            headers: {},
            body: JSON.stringify(response),
            timestamp: endTimestamp.toISOString(),
            duration: endTimestamp.getTime() - startTimestamp.getTime(),
          },
        }

        // 异步更新存储，不阻塞响应
        storage.setItem(`client:${clientId}:logs`, updatedLogs).catch(console.error)
      }

      return response
    }
    catch (error: any) {
      // 处理错误情况
      const endTimestamp = new Date()
      const errorResult = {
        ...result,
        status: 'error' as const,
        error: error.message || 'Unknown error',
        lastAt: endTimestamp,
        timeUsage: endTimestamp.getTime() - startTimestamp.getTime(),
      }

      // 更新错误日志
      const updatedLogs = await storage.getItem<any[]>(`client:${clientId}:logs`) || []
      const logIndex = updatedLogs.findIndex(log => log.id === logId)
      if (logIndex !== -1) {
        updatedLogs[logIndex] = {
          ...updatedLogs[logIndex],
          ...errorResult,
          responseInfo: {
            status: error.status || 500,
            error: error.message,
            timestamp: endTimestamp.toISOString(),
            duration: endTimestamp.getTime() - startTimestamp.getTime(),
          },
        }

        // 异步更新存储
        storage.setItem(`client:${clientId}:logs`, updatedLogs).catch(console.error)
      }

      throw error
    }
  }
  catch (error: any) {
    // 处理外层错误（如客户端不存在等）
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})

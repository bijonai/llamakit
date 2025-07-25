import type { ClientData, CreateClientBody, CreateClientResponse } from '../../types/api'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event): Promise<CreateClientResponse> => {
  const body = await readBody<CreateClientBody>(event)

  // 验证请求体
  if (!body.apiKey || !body.baseUrl || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: apiKey, baseUrl, or name',
    })
  }

  // 验证URL格式
  try {
    // eslint-disable-next-line no-new
    new URL(body.baseUrl)
  }
  catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid baseUrl format',
    })
  }

  const clientId = randomUUID()
  const storage = useStorage('redis')

  try {
    // 存储client信息到KV storage
    const clientData: ClientData = {
      id: clientId,
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
      name: body.name,
      createdAt: new Date().toISOString(),
    }

    await storage.setItem(`client:${clientId}`, clientData)

    // 同时维护一个client列表用于分页查询
    const clientList = await storage.getItem<string[]>('client:list') || []
    clientList.push(clientId)
    await storage.setItem('client:list', clientList)

    return {
      id: clientId,
    }
  }
  catch {
    // 清理可能已创建的数据
    await storage.removeItem(`client:${clientId}`).catch(() => {})

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create client',
    })
  }
})

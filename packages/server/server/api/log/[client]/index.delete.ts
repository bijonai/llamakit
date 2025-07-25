import type { ClearLogsResponse } from '../../../types/api'

export default defineEventHandler(async (event): Promise<ClearLogsResponse> => {
  const clientId = getRouterParam(event, 'client')

  if (!clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Client ID is required',
    })
  }

  const storage = useStorage('redis')

  try {
    // 检查client是否存在
    const clientData = await storage.getItem(`client:${clientId}`)
    if (!clientData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Client not found',
      })
    }

    // 获取当前日志数量
    const currentLogs = await storage.getItem<any[]>(`client:${clientId}:logs`) || []
    const clearedCount = currentLogs.length

    // 清空日志
    await storage.setItem(`client:${clientId}:logs`, [])

    return {
      success: true,
      message: 'Logs cleared successfully',
      clearedCount,
    }
  }
  catch (error: any) {
    // 如果是已知错误，直接抛出
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear logs',
    })
  }
})

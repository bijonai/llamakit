import type { GetLogsQuery, GetLogsResponse, LogEntry } from '../../../types/api'

export default defineEventHandler(async (event): Promise<GetLogsResponse> => {
  const clientId = getRouterParam(event, 'client')
  const query = getQuery<GetLogsQuery>(event)

  if (!clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Client ID is required',
    })
  }

  const limit = Math.min(Number(query.limit) || 20, 100)
  const offset = Number(query.offset) || 0
  const statusFilter = query.status

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

    // 获取所有日志
    const allLogs = await storage.getItem<LogEntry[]>(`client:${clientId}:logs`) || []

    // 按状态过滤
    let filteredLogs = allLogs
    if (statusFilter) {
      filteredLogs = allLogs.filter(log => log.status === statusFilter)
    }

    const total = filteredLogs.length
    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return {
      logs: paginatedLogs,
      total,
      limit,
      offset,
    }
  }
  catch (error: any) {
    // 如果是已知错误，直接抛出
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch logs',
    })
  }
})

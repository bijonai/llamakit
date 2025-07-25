import type { ClientData, GetClientsQuery, GetClientsResponse } from '../../types/api'

export default defineEventHandler(async (event): Promise<GetClientsResponse> => {
  const query = getQuery<GetClientsQuery>(event)

  const limit = Math.min(Number(query.limit) || 10, 100) // 最大100个
  const offset = Number(query.offset) || 0

  const storage = useStorage('redis')

  try {
    // 获取所有client ID列表
    const clientList = await storage.getItem<string[]>('client:list') || []
    const total = clientList.length

    // 分页获取client数据
    const paginatedIds = clientList.slice(offset, offset + limit)
    const clients: ClientData[] = []

    for (const clientId of paginatedIds) {
      const clientData = await storage.getItem<ClientData>(`client:${clientId}`)
      if (clientData) {
        clients.push(clientData)
      }
    }

    return {
      clients,
      total,
      limit,
      offset,
    }
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch clients',
    })
  }
})

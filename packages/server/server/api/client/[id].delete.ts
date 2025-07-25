interface RemoveClientResponse {
  success: boolean
  message: string
}

export default defineEventHandler(async (event): Promise<RemoveClientResponse> => {
  const clientId = getRouterParam(event, 'id')

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

    // 事务性删除：先删除相关数据，再删除客户端
    // 清理相关的日志数据
    await storage.removeItem(`client:${clientId}:logs`)

    // 从client列表中移除
    const clientList = await storage.getItem<string[]>('client:list') || []
    const updatedList = clientList.filter(id => id !== clientId)
    await storage.setItem('client:list', updatedList)

    // 最后删除client数据
    await storage.removeItem(`client:${clientId}`)

    return {
      success: true,
      message: 'Client removed successfully',
    }
  }
  catch (error: any) {
    // 如果是已知错误，直接抛出
    if (error.statusCode) {
      throw error
    }

    // 处理未知错误
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to remove client',
    })
  }
})

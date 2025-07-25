import type { ClientData, UpdateClientBody, UpdateClientResponse } from '../../types/api'

export default defineEventHandler(async (event): Promise<UpdateClientResponse> => {
  const clientId = getRouterParam(event, 'id')
  const body = await readBody<UpdateClientBody>(event)

  if (!clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Client ID is required',
    })
  }

  const storage = useStorage('redis')

  try {
    // 获取现有client数据
    const existingClient = await storage.getItem<ClientData>(`client:${clientId}`)
    if (!existingClient) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Client not found',
      })
    }

    // 更新client数据
    const updatedClient: ClientData = {
      ...existingClient,
      ...(body.name && { name: body.name }),
      ...(body.baseUrl && { baseUrl: body.baseUrl }),
      ...(body.apiKey && { apiKey: body.apiKey }),
      updatedAt: new Date().toISOString(),
    }

    await storage.setItem(`client:${clientId}`, updatedClient)

    return {
      success: true,
      message: 'Client updated successfully',
      client: updatedClient,
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
      statusMessage: 'Failed to update client',
    })
  }
})

import type { HttpRequestBody } from '../../types/api'
import { HttpRequestTool } from '../../utils/httpRequestTool'

export default defineEventHandler(async (event) => {
  try {
    const body: HttpRequestBody = await readBody(event)

    if (!body.url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required',
      })
    }

    // 记录请求发起方信息
    const userAgent = getHeader(event, 'user-agent') || 'Unknown'
    const clientIp = event.node.req.socket?.remoteAddress
      || getHeader(event, 'x-forwarded-for')
      || getHeader(event, 'x-real-ip') || 'Unknown'
    const referer = getHeader(event, 'referer') || 'Direct'

    // 使用工具类发起请求
    const result = await HttpRequestTool.makeRequest(body)

    // 更新请求发起方信息
    result.request.initiator = {
      userAgent,
      clientIp,
      referer,
    }

    return result
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
      data: { error: error.message },
    })
  }
})

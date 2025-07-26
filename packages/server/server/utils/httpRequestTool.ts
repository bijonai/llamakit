import type { HttpRequestBody, HttpRequestResponse } from '../types/api'

export class HttpRequestTool {
  static async makeRequest(requestData: HttpRequestBody): Promise<HttpRequestResponse> {
    const { url, method = 'GET', headers = {}, queryParams = {}, bodyData, timeout = 30000 } = requestData

    // 验证URL格式
    let urlObj: URL
    try {
      urlObj = new URL(url)
    }
    catch {
      throw new Error('Invalid URL format')
    }

    // 构建请求信息
    const requestStartTime = Date.now()
    const requestTimestamp = new Date().toISOString()

    // 构建URL
    Object.entries(queryParams).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value))
    })
    const fullUrl = urlObj.toString()

    // 准备请求选项
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        ...headers,
      },
      signal: AbortSignal.timeout(timeout),
    }

    // 添加请求体
    if (method.toUpperCase() !== 'GET' && bodyData) {
      if (typeof bodyData === 'object') {
        fetchOptions.body = JSON.stringify(bodyData)
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        }
      }
      else {
        fetchOptions.body = String(bodyData)
      }
    }

    let responseData: any = {}
    let requestError: string | undefined

    try {
      // 发起HTTP请求
      const response = await fetch(fullUrl, fetchOptions)
      const responseEndTime = Date.now()
      const duration = responseEndTime - requestStartTime

      // 获取响应头
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // 获取响应体
      let responseBody: any
      let responseSize = 0
      const contentType = response.headers.get('content-type') || ''

      try {
        if (contentType.includes('application/json')) {
          responseBody = await response.json()
          responseSize = JSON.stringify(responseBody).length
        }
        else if (contentType.includes('text/') || contentType.includes('application/xml')) {
          responseBody = await response.text()
          responseSize = responseBody.length
        }
        else {
          // 二进制数据转换为base64
          const arrayBuffer = await response.arrayBuffer()
          responseSize = arrayBuffer.byteLength
          responseBody = {
            type: 'binary',
            contentType,
            size: responseSize,
            data: btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))),
          }
        }
      }
      catch (bodyError) {
        responseBody = `Failed to parse response body: ${bodyError}`
        responseSize = 0
      }

      // 检查缓存信息
      const cacheControl = response.headers.get('cache-control')
      const etag = response.headers.get('etag')
      const lastModified = response.headers.get('last-modified')

      // 检查重定向信息
      const redirected = response.redirected
      const redirectUrl = response.url !== fullUrl ? response.url : undefined

      responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        size: responseSize,
        duration,
        timestamp: new Date().toISOString(),
        cache: {
          cacheControl,
          etag,
          lastModified,
        },
        redirect: {
          redirected,
          finalUrl: redirectUrl,
        },
      }
    }
    catch (error: any) {
      const responseEndTime = Date.now()
      const duration = responseEndTime - requestStartTime

      requestError = error.message || 'Request failed'

      responseData = {
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        body: null,
        size: 0,
        duration,
        timestamp: new Date().toISOString(),
        error: requestError,
        cache: {},
        redirect: {
          redirected: false,
        },
      }
    }

    // 构建返回数据
    const result: HttpRequestResponse = {
      request: {
        url: fullUrl,
        originalUrl: url,
        method: method.toUpperCase(),
        headers: fetchOptions.headers as Record<string, string>,
        queryParams,
        body: bodyData || null,
        timestamp: requestTimestamp,
        initiator: {
          userAgent: 'LlamaKit-Server',
          clientIp: 'localhost',
          referer: 'Internal',
        },
      },
      response: responseData,
      summary: {
        success: !requestError,
        duration: responseData.duration,
        statusCode: responseData.status,
        responseSize: responseData.size,
        error: requestError,
      },
    }

    return result
  }
}

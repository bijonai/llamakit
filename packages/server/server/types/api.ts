// 客户端相关类型
export interface ClientData {
  id: string
  apiKey: string
  baseUrl: string
  name: string
  createdAt: string
  updatedAt?: string
}

export interface CreateClientBody {
  apiKey: string
  baseUrl: string
  name: string
}

export interface CreateClientResponse {
  id: string
}

export interface UpdateClientBody {
  name?: string
  baseUrl?: string
  apiKey?: string
}

export interface UpdateClientResponse {
  success: boolean
  message: string
  client: ClientData
}

export interface RemoveClientResponse {
  success: boolean
  message: string
}

export interface GetClientsQuery {
  limit?: number
  offset?: number
}

export interface GetClientsResponse {
  clients: ClientData[]
  total: number
  limit: number
  offset: number
}

// 日志相关类型
export interface LogEntry {
  id: string
  status: 'pending' | 'running' | 'success' | 'error'
  startAt: string
  lastAt?: string
  timeUsage?: number
  inputs: any[]
  outputs?: any[]
  usage?: any
  error?: string
  requestInfo: {
    url: string
    method: string
    headers: Record<string, string>
    body: string
    timestamp: string
  }
  responseInfo?: {
    status: number
    headers?: Record<string, string>
    body?: string
    timestamp: string
    duration: number
    error?: string
  }
}

export interface GetLogsQuery {
  limit?: number
  offset?: number
  status?: string
}

export interface GetLogsResponse {
  logs: LogEntry[]
  total: number
  limit: number
  offset: number
}

export interface ClearLogsResponse {
  success: boolean
  message: string
  clearedCount: number
}

// HTTP请求工具相关类型
export interface HttpRequestBody {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  headers?: Record<string, string>
  queryParams?: Record<string, any>
  bodyData?: any
  timeout?: number
}

export interface HttpRequestInfo {
  url: string
  originalUrl: string
  method: string
  headers: Record<string, string>
  queryParams: Record<string, any>
  body: any
  timestamp: string
  initiator: {
    userAgent: string
    clientIp: string
    referer: string
  }
}

export interface HttpResponseInfo {
  status: number
  statusText: string
  headers: Record<string, string>
  body: any
  size: number
  duration: number
  timestamp: string
  error?: string
  cache: {
    cacheControl?: string
    etag?: string
    lastModified?: string
  }
  redirect: {
    redirected: boolean
    finalUrl?: string
  }
}

export interface HttpRequestResponse {
  request: HttpRequestInfo
  response: HttpResponseInfo
  summary: {
    success: boolean
    duration: number
    statusCode: number
    responseSize: number
    error?: string
  }
}

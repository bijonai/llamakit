import type { ChatCompletionResponse, ChatMessage, ChatRequestBody, Usage } from '../types/chat'
import type { TransformerOptions } from './index'
import { createTransform } from './index'

export enum LogStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  ERROR = 'error',
}
export type ChatLog = ({
  status: LogStatus.PENDING | LogStatus.RUNNING
  startAt: Date
} | (({
  status: LogStatus.SUCCESS
  outputs: ChatMessage[]
  usage: Usage
} | {
  status: LogStatus.ERROR
  error: string
}) & {
  lastAt: Date
  timeUsage: number
})) & {
  inputs: ChatMessage[]
}

export function createChatTransformer(options: TransformerOptions) {
  return (body: ChatRequestBody, params: {
    timestamp: Date
  }) => createTransform<ChatRequestBody, ChatCompletionResponse, ChatLog>(options)(
    body,
    (req) => {
      return {
        status: LogStatus.PENDING,
        startAt: params.timestamp,
        inputs: req.messages,
      }
    },
    (res, o, params: object) => {
      const timestamp = (params as { timestamp: Date }).timestamp
      return {
        ...o,
        status: LogStatus.SUCCESS,
        lastAt: timestamp,
        timeUsage: o.status === LogStatus.RUNNING || o.status === LogStatus.PENDING ? timestamp.getTime() - o.startAt.getTime() : 0,
        outputs: res.choices?.map(choice => choice.message) || [],
        usage: res.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      }
    },
  )
}

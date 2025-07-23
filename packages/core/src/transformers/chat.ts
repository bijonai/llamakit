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
    (res) => {
      return {}
    }
  )
}

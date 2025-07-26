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
  outputSize: number // Unit: KB
  usage: Usage
} | {
  status: LogStatus.ERROR
  error: string
}) & {
  lastAt: Date
  timeUsage: number
})) & {
  inputs: ChatMessage[]
  inputSize: number // Unit: KB
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
        inputSize: JSON.stringify(req).length / 1024,
      }
    },
    (res, o, params: object) => {
      const timestamp = (params as { timestamp: Date }).timestamp
      const outputs = res.choices?.map(choice => choice.message) || []
      return {
        ...o,
        status: LogStatus.SUCCESS,
        lastAt: timestamp,
        timeUsage: o.status === LogStatus.RUNNING || o.status === LogStatus.PENDING ? timestamp.getTime() - o.startAt.getTime() : 0,
        outputs,
        outputSize: JSON.stringify(outputs).length / 1024,
        usage: res.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      }
    },
  )
}

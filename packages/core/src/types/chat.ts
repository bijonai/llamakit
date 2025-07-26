export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface ChatSystemMessage {
  role: 'system'
  content: string
}

export interface ChatUserMessage {
  role: 'user'
  content: string
}

export interface ChatAssistantMessage {
  role: 'assistant'
  content: string
  tool_choices?: ToolCall[]
}

export interface ChatToolMessage {
  role: 'tool'
  content: string
  tool_call_id: string
}

export type ChatMessage = (ChatSystemMessage | ChatUserMessage | ChatAssistantMessage | ChatToolMessage) & {
  id?: string
}

export interface Tool {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters: object
  }
}

export interface ChatResponseJsonSchemaFormat {
  type: 'json_schema'
  json_schema: {
    name: string
    schema: object
    description?: string
    strict?: boolean
  }
}
export interface ChatResponseJsonObjectFormat {
  type: 'json_object'
}
export interface ChatResponseTextFormat {
  type: 'text'
}
export type ChatResponseFormat = ChatResponseJsonSchemaFormat | ChatResponseJsonObjectFormat | ChatResponseTextFormat

export interface ChatRequestBody {
  messages: ChatMessage[]
  model: string
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  logit_bias?: Record<string, number>
  user?: string
  tools?: Tool[]
  tool_choice?: 'none' | 'auto' | Tool
  response_format?: ChatResponseFormat
  seed?: number
}

export type FinishReason = 'stop' | 'length' | 'tool_calls' | 'content_filter' | string
export interface ChatCompletionChoice {
  index: number
  message: ChatMessage
  logprobs: any | null
  finish_reason: FinishReason
}

export interface PromptTokensDetails {
  cached_tokens: number
  audio_tokens: number
}

export interface CompletionTokensDetails {
  reasoning_tokens: number
  audio_tokens: number
  accepted_prediction_tokens: number
  rejected_prediction_tokens: number
}

export interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  prompt_tokens_details: PromptTokensDetails
  completion_tokens_details: CompletionTokensDetails
}

export interface ChatCompletionResponse {
  id: string
  created: Date
  model: string
  choices: ChatCompletionChoice[]
  usage: Usage
}

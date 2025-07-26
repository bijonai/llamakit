<script setup lang="ts">
import ArrowButton from './ArrowButton.vue';
import { defineEmits } from 'vue';
import StatusTag from './StatusTag.vue';
import { type ChatMessage } from '@llamakit/core';
import SystemMessage from './message/SystemMessage.vue';
import UserMessage from './message/UserMessage.vue';
import AssistantMessage from './message/AssistantMessage.vue';
import ToolMessage from './message/ToolMessage.vue';

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  status: 'pending' | 'complete' | 'error' | 'running' | 'timeout'
  startAt: string
  lastAt: string
  timeUsage: number
  inputSize: number
  outputSize: number
  messages: ChatMessage[]
}>()
</script>

<template>
  <div class="w-full h-screen p-2">
    <div class="flex flex-col w-full h-full overflow-y-auto p-5 box">
      <div class="flex flex-row w-full items-center">
        <ArrowButton direction="right" class="ml-auto" @click="emit('close')" />
      </div>
      <div class="flex flex-col w-full h-full">
        <table class="w-full text-gray-500">
          <tr class="border-b border-gray-500">
            <td>
              Status
            </td>
            <td class="p-2">
              <StatusTag :status="props.status" />
            </td>
          </tr>
          <tr class="border-b border-gray-500">
            <td>
              Request Created At
            </td>
            <td class="p-2">
              {{ props.startAt }}
            </td>
          </tr>
          <tr class="border-b border-gray-500">
            <td>
              Response At
            </td>
            <td class="p-2">
              {{ props.lastAt }}
            </td>
          </tr>
          <tr class="border-b border-gray-500">
            <td>
              Time Usage
            </td>
            <td class="p-2">
              {{ props.timeUsage }}s
            </td>
          </tr>
          <tr class="border-b border-gray-500">
            <td>
              Input Size
            </td>
            <td class="p-2">
              {{ props.inputSize }} KB
            </td>
          </tr>
          <tr class="border-b border-gray-500">
            <td>
              Output Size
            </td>
            <td class="p-2">
              {{ props.outputSize }} KB
            </td>
          </tr>
        </table>
        <div class="flex w-full flex-col gap-y-2 py-5">
          <div v-for="message in props.messages" :key="message.id" class="flex flex-row w-full items-center">
            <SystemMessage v-if="message.role === 'system'" :content="message.content" role="system" />
            <UserMessage v-else-if="message.role === 'user'" :content="message.content" role="user" />
            <AssistantMessage v-else-if="message.role === 'assistant'" :content="message.content" role="assistant"
              :tool-choices="message.tool_choices" />
            <ToolMessage v-else-if="message.role === 'tool'" :content="message.content" role="tool"
              :tool-call-id="message.tool_call_id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  border-radius: 12.5px;
  border: 2px solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
}

tr {
  height: 40px;
}
</style>

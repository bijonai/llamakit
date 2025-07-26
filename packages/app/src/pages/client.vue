<script setup lang="ts">
import SearchBar from '../components/SearchBar.vue';
import SearchButton from '../components/SearchButton.vue';
import ArrowButton from '../components/ArrowButton.vue';
import LogItem from '../components/LogItem.vue';

import { useRoute, useRouter } from 'vue-router';
import SystemMessage from '../components/message/SystemMessage.vue';
import UserMessage from '../components/message/UserMessage.vue';
import AssistantMessage from '../components/message/AssistantMessage.vue';
import ToolMessage from '../components/message/ToolMessage.vue';

const route = useRoute()
const router = useRouter()

const clientId = route.params.id
const clientName = route.query.name
</script>

<template>
  <div class="flex flex-col gap-y-3 px-80 py-10">
    <div class="flex flex-row gap-x-3 items-center">
      <ArrowButton direction="left" @click="router.push('/')" />
      <span class="text-white text-2xl font-bold">{{ clientName }}</span>
    </div>
    <div class="flex flex-row w-full gap-x-3">
      <SearchBar placeholder="Filter clients" />
      <SearchButton />
      <ArrowButton direction="down" />
    </div>
    <div class="flex flex-col w-full gap-y-3">
      <LogItem status="pending" />
      <LogItem status="complete" />
      <LogItem status="running" />
      <LogItem status="error" />
      <LogItem status="timeout" />
      <SystemMessage role="system" content="You are a helpful assistant." />
      <UserMessage role="user" content="Hello, how are you?" />
      <AssistantMessage role="assistant" content="I'm good, thank you!" :tool-choices="[{
        id: '1',
        type: 'function',
        function: {
          name: 'get_weather',
          arguments: JSON.stringify({ city: 'New York' })
        }
      }]" />
      <ToolMessage role="tool" content="The weather in New York is sunny." tool-call-id="1" />
    </div>
  </div>
</template>
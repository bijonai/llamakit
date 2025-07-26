<script setup lang="ts">
const props = defineProps<{
  createdAt: string
  responsedAt?: string
  totalSize: number
  messageCount: number
}>()
</script>

<template>
  <div class="flex flex-row text-white text-sm gap-2">
    <div class="text-gray-500">
      Created At
    </div>
    <div class="text-white">
      {{ props.createdAt }}
    </div>
  </div>
  <div v-if="props.responsedAt" class="flex flex-row text-white text-sm gap-2">
    <div class="text-gray-500">
      Response At
    </div>
    <div class="text-white">
      {{ props.responsedAt }}
    </div>
  </div>
  <div class="flex flex-row text-white text-sm gap-2">
    <div class="text-gray-500">
      Total Size
    </div>
    <div class="text-white">
      {{ props.totalSize }} KB
    </div>
  </div>
  <div class="flex flex-row text-white text-sm gap-2">
    <div class="text-gray-500">
      Message Count
    </div>
    <div class="text-white">
      {{ props.messageCount }}
    </div>
  </div>
</template>
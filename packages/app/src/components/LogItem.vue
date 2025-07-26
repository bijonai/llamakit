<script setup lang="ts">
import StatusTag from './StatusTag.vue';

const props = defineProps<{
  // id: string
  status: 'pending' | 'complete' | 'running' | 'error' | 'timeout'
}>()
</script>

<template>
  <div class="box p-5">
    <div class="w-full h-full flex flex-col">
      <div class="w-full flex flex-row items-center">
        <div class="flex">test</div>
        <div class="flex ml-auto items-start h-full">
          <StatusTag :status="props.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  border-radius: 25px;
  border: 2px solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  height: 150px;
}
</style>
<script setup lang="ts">
const props = defineProps<{
  name: string
  id: string
}>()
</script>

<template>
  <div class="container p-5">
    <div class="w-full h-full flex flex-col">
      <div class="w-full flex flex-row items-center">
        <div class="text-white font-bold">{{ props.name }}</div>
        <div class="ml-auto text-xs text-gray-500">{{ props.id }}</div>
      </div>
      <div class="w-full flex flex-row items-center">
        <div class="text-xs text-gray-500">No description</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 25px;
  border: 1px solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  height: 150px;
}
</style>
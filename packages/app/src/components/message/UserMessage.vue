<script setup lang="ts">
const props = defineProps<{
  role: string
  content: string
}>()
</script>

<template>
  <div class="container p-5">
    <div class="w-full h-full flex flex-col">
      <div class="w-full flex flex-row items-center">
        <div class="flex text-gray-500">
          {{ props.role }}
        </div>
      </div>
      <div class="w-full flex flex-row items-center">
        <div class="flex text-white text-sm">
          {{ props.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 25px;
  border: 2px solid #454545;
  background: #161618;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  min-height: 150px;
}
</style>

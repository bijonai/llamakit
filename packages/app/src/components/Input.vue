<script setup lang="ts">
import { defineModel } from 'vue'

const props = defineProps<{
  placeholder: string
}>()

const model = defineModel<string>('modelValue')
</script>

<template>
  <div class="w-full">
    <input class="container py-2 px-5 text-white" :placeholder="props.placeholder" v-model="model" />
  </div>
</template>

<style scoped>
.container {
  border-radius: 12.5px;
  border: 2px solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  height: 45px
}
</style>
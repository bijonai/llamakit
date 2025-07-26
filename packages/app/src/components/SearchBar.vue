<script setup lang="ts">
import { defineModel } from 'vue'

const props = defineProps<{
  placeholder: string
}>()

const model = defineModel<string>('modelValue')
</script>

<template>
  <input class="container text-white py-2 px-5 focus:outline-none" v-model="model" :placeholder="props.placeholder" />
</template>

<style scoped>
.container {
  border-radius: 50px;
  border: 1px solid #454545;
  background: #161618;
  height: 45px;
}

.container:focus {
  border: 1px solid #454545;
}
</style>

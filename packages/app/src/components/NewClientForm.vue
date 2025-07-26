<script setup lang="ts">
import Input from './Input.vue';
import Button from './Button.vue';
import { defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create'): void
}>()
</script>

<template>
  <div class="size-full flex justify-center items-center">
    <div class="container p-5">
      <h1 class="title py-5">New Client</h1>
      <div class="w-full flex flex-col items-center gap-y-2">
        <Input placeholder="Name" />
        <Input placeholder="API Key" />
        <Input placeholder="Base URL" />
        <div class="flex w-full flex-row gap-x-2">
          <Button color="primary" @click="emit('close')">Cancel</Button>
          <Button color="success" @click="emit('create')">Create</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 20px;
  border: 1px solid #454545;
  background: #161618;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  width: 500px;
}

.title {
  color: #DFDFD6;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #DFDFD6;
  font-family: Helvetica;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
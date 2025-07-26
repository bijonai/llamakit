<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import Button from './Button.vue'
import Input from './Input.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', data: { name: string, apiKey: string, baseUrl: string }): void
}>()

const name = ref('')
const apiKey = ref('')
const baseUrl = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleCreate() {
  if (!name.value || !apiKey.value || !baseUrl.value) {
    errorMessage.value = 'Please fill in all fields'
    console.error('Please fill in all fields')
    return
  }

  isLoading.value = true

  try {
    const response = await fetch('/api/client/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        apiKey: apiKey.value,
        baseUrl: baseUrl.value,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.statusMessage || 'Failed to create client')
    }

    // 喵
    // 请求base url
    const API_BASE = 'http://localhost:3000'
    try {
      const response1 = await fetch(`${API_BASE}/api/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://jsonplaceholder.typicode.com/posts/1',
        }),
      })

      const result1 = await response1.json()
      console.log(`状态码: ${result1.response.status}`)
      console.log(`耗时: ${result1.summary.duration}ms`)
      console.log(`响应大小: ${result1.summary.responseSize} bytes\n`)
    }
    catch (error) {
      console.log('❌ GET请求失败:', error.message, '\n')
    }

    await response.json()
    emit('create', { name: name.value, apiKey: apiKey.value, baseUrl: baseUrl.value })
  }
  catch (error) {
    errorMessage.value = `Error creating client: ${error}`
    console.error('Error creating client:', error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="size-full flex justify-center items-center">
    <div class="container p-5">
      <h1 class="title py-5">
        New Client
      </h1>
      <div class="w-full flex flex-col items-center gap-y-2">
        <Input v-model="name" placeholder="Name" />
        <Input v-model="apiKey" placeholder="API Key" />
        <Input v-model="baseUrl" placeholder="Base URL" />
        <div class="flex w-full flex-row gap-x-2">
          <Button color="primary" :disabled="isLoading" @click="emit('close')">
            Cancel
          </Button>
          <Button color="success" :disabled="isLoading" @click="handleCreate">
            {{ isLoading ? 'Creating...' : 'Create' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 20px;
  border: 2px solid #454545;
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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddButton from '../components/AddButton.vue'
import ClientItem from '../components/ClientItem.vue'
import NewClientForm from '../components/NewClientForm.vue'
import SearchBar from '../components/SearchBar.vue'
import SearchButton from '../components/SearchButton.vue'

interface Client {
  id: string
  name: string
  apiKey: string
  baseUrl: string
  createdAt: string
}

const isNewClientFormOpen = ref(false)
const clients = ref<Client[]>([])
const isLoading = ref(false)

async function fetchClients() {
  isLoading.value = true
  try {
    const response = await fetch('/api/client?limit=100&offset=0')
    if (response.ok) {
      const data = await response.json()
      clients.value = data.clients
    }
    else {
      console.error('Failed to fetch clients:', response.statusText)
    }
  }
  catch (error) {
    console.error('Error fetching clients:', error)
  }
  finally {
    isLoading.value = false
  }
}

function handleClientCreate() {
  isNewClientFormOpen.value = false
  // 重新获取客户端列表
  fetchClients()
}

function handleClientDelete(clientId: string) {
  // 从列表中移除已删除的客户端
  clients.value = clients.value.filter(client => client.id !== clientId)
}

onMounted(() => {
  fetchClients()
})
</script>

<template>
  <div class="size-full px-80 py-10">
    <div v-if="isNewClientFormOpen" class="absolute top-0 left-0 size-full bg-black/50">
      <NewClientForm @close="isNewClientFormOpen = false" @create="handleClientCreate" />
    </div>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-row w-full gap-x-3">
        <SearchBar placeholder="Filter clients" />
        <SearchButton />
        <AddButton @click="isNewClientFormOpen = true" />
      </div>
      <div v-if="isLoading" class="text-white text-center">
        Loading clients...
      </div>
      <div v-else-if="clients.length === 0" class="text-white text-center">
        No clients found
      </div>
      <div v-else class="flex flex-col w-full gap-y-3">
        <ClientItem
          v-for="client in clients"
          :id="client.id"
          :key="client.id"
          :name="client.name"
          @delete="handleClientDelete"
        />
      </div>
    </div>
  </div>
</template>

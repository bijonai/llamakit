<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  name: string
  id: string
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const router = useRouter()

async function handleDelete(event: Event) {
  event.stopPropagation()

  if (confirm(`Are you sure you want to delete client "${props.name}"? This action cannot be undone.`)) {
    try {
      const response = await fetch(`/api/client/${props.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        emit('delete', props.id)
      }
      else {
        const error = await response.json()
        alert(`Delete failed: ${error.message || 'Unknown error'}`)
      }
    }
    catch (error) {
      alert(`Delete failed: ${error}`)
    }
  }
}
</script>

<template>
  <div class="container p-5" @click="router.push(`/client/${props.id}?name=${props.name}`)">
    <div class="w-full h-full flex flex-col relative">
      <div class="w-full flex flex-row items-center">
        <div class="text-white font-bold">
          {{ props.name }}
        </div>
        <div class="ml-auto text-xs text-gray-500">
          {{ props.id }}
        </div>
      </div>
      <div class="w-full flex flex-row items-center">
        <div class="text-xs text-gray-500">
          No description
        </div>
      </div>
      <button
        class="delete-btn text-red-400 hover:text-red-300 text-sm px-2 py-1 hover:border-red-300 transition-colors absolute bottom-0 right-0"
        style="border-radius: 5px; border: 2px solid #f87171; font-weight: bold;"
        title="Delete client"
        @click="handleDelete"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 25px;
  border: 2px solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  height: 150px;
}

.container:hover {
  background: #21212180;
}

.delete-btn {
  background: transparent;
  font-size: 12px;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}
</style>

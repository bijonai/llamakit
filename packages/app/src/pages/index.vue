<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import SearchButton from '../components/SearchButton.vue'
import AddButton from '../components/AddButton.vue'
import ClientItem from '../components/ClientItem.vue'
import NewClientForm from '../components/NewClientForm.vue'

const isNewClientFormOpen = ref(false)
</script>

<template>
  <div class="absolute top-0 left-0 size-full bg-black/50" v-if="isNewClientFormOpen">
    <NewClientForm @close="isNewClientFormOpen = false" @create="isNewClientFormOpen = false" />
  </div>
  <div class="flex flex-col gap-y-3">
    <div class="flex flex-row w-full gap-x-3">
      <SearchBar placeholder="Filter clients" />
      <SearchButton />
      <AddButton @click="isNewClientFormOpen = true" />
    </div>
    <div class="flex flex-row w-full gap-x-3">
      <ClientItem name="John Doe" id="1234567890" />
    </div>
  </div>
</template>
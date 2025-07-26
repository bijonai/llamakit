<script setup lang="ts">
import ToolChoice from './ToolChoice.vue';

const props = withDefaults(defineProps<{
  role: string
  content: string
  toolChoices?: {
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }[]
}>(), {
  toolChoices: () => []
})
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
      <div v-if="toolChoices" class="w-full flex flex-col items-center">
        <hr class="w-full border-gray-500 my-3" />
        <div class="w-full grid-cols-3 gap-2">
          <div v-for="toolChoice in toolChoices" :key="toolChoice.id" class="flex flex-row items-center">
            <ToolChoice :name="toolChoice.function.name" :arguments="toolChoice.function.arguments"
              :id="toolChoice.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 25px;
  border: 2x solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  min-height: 150px;
}
</style>

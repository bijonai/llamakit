<script setup lang="ts">
import { createHighlighter } from 'shiki';
import { onMounted, ref } from 'vue';

const json = ref('')

onMounted(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['json'],
  });

  const formatted = JSON.stringify(JSON.parse(props.arguments), null, 2)
  json.value = highlighter.codeToHtml(formatted, { lang: 'json', theme: 'github-dark' });
})

const props = defineProps<{
  name: string
  arguments: string
  id: string
}>()
</script>

<template>
  <div class="container p-5">
    <div class="w-full flex flex-col gap-y-2">
      <div class="flex flex-row text-white text-sm gap-2">
        <div class="text-gray-500">
          Tool Name
        </div>
        <div class="text-white">
          {{ props.name }}
        </div>
      </div>
      <div class="flex flex-row text-white text-sm gap-2">
        <div class="text-gray-500">
          Tool ID
        </div>
        <div class="text-white">
          {{ props.id }}
        </div>
      </div>
      <div class="flex flex-row text-white text-sm gap-2">
        <div class="text-gray-500">
          Tool Arguments:
        </div>
        <div class="text-white">
          <div v-html="json"/>
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

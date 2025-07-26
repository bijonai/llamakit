<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status: 'pending' | 'complete' | 'running' | 'error' | 'timeout'
}>()

const text = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'Pending'
    case 'complete':
      return 'Complete'
    case 'running':
      return 'Running'
    case 'error':
      return 'Error'
    case 'timeout':
      return 'Timeout'
  }
})
</script>

<template>
  <div class="container" :class="`${props.status}`">{{ text }}</div>
</template>

<style scoped>
.container {
  width: 80px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.pending {
  border-radius: 50px;
  border: 2px solid #4D4D4D;
  background: rgba(87, 87, 87, 0.75);
}

.complete {
  border-radius: 50px;
  border: 2px solid #3FB613;
  background: rgba(80, 198, 40, 0.75);
}

.running {
  border-radius: 50px;
  border: 2px solid #CAA216;
  background: rgba(221, 179, 50, 0.75);
}

.error {
  border-radius: 50px;
  border: 2px solid #CA543F;
  background: rgba(219, 100, 79, 0.75);
}

.timeout {
  border-radius: 50px;
  border: 2px solid #CA543F;
  background: rgba(219, 100, 79, 0.75);
}
</style>

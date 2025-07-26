<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  direction: 'left' | 'right' | 'up' | 'down'
}>()

const angle = computed(() => {
  switch (props.direction) {
    case 'left':
      return 90
    case 'right':
      return -90
    case 'up':
      return 180
    case 'down':
      return 0
  }
})
</script>

<template>
  <div class="container text-white p-3 flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 35 19" fill="none" :style="{ transform: `rotate(${angle}deg)` }">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M0.640698 0.618325C1.49498 -0.206108 2.88002 -0.206108 3.73431 0.618325L17.5 13.9034L31.2658 0.618325C32.12 -0.206108 33.5051 -0.206108 34.3593 0.618325C35.2136 1.44278 35.2136 2.77946 34.3593 3.60391L19.0468 18.3817C18.1926 19.2061 16.8075 19.2061 15.9532 18.3817L0.640698 3.60391C-0.213566 2.77946 -0.213566 1.44278 0.640698 0.618325Z"
        fill="#DFDFD6" />
    </svg>
  </div>
</template>

<style scoped>
.container {
  background-color: #212121;
  border-radius: 50px;
  border: 2px solid #454545;
  height: 45px;
  width: 45px;
}

.container:hover {
  background: #21212180;
}
</style>

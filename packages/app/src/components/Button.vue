<template>
  <div class="w-full">
    <button class="container" :class="`container-${props.color}`">
      <span class="text">
        <slot />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  color: 'primary' | 'success'
}>()
</script>

<style scoped>
.container-primary {
  border-radius: 12.5px;
  border: 2px solid #454545;
  background: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  height: 45px;
}

.container-success {
  border-radius: 12.5px;
  border: 2px solid #3ECF8E;
  background: #2C7051;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  height: 45px;
}

.text {
  color: #DFDFD6;
  -webkit-text-stroke-color: #DFDFD6;
  font-family: Helvetica;
  font-size: 16px;
  font-style: normal;
  line-height: normal;
}
</style>

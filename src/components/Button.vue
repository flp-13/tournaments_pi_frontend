<script setup lang="ts">
withDefaults(defineProps<{
  type: 'button' | 'submit' | 'reset'
  loading: boolean
}>(), {
  type: 'button',
  loading: false,
});
</script>

<template>
  <button :type="type" relative overflow-hidden :disabled="loading">
    <div v-if="loading" opacity-50 w-full h-full absolute z-1 top-0 left-0>
      <Skeletor width="100%" height="100%" />
    </div>
    <slot></slot>
  </button>
</template>

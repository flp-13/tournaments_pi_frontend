<script setup lang="ts">
withDefaults(defineProps<{
  type: 'button' | 'submit' | 'reset'
}>(), {
  round: false,
  type: 'button'
});
</script>
<template>
  <button :type="type">
    <slot></slot>
  </button>
</template>
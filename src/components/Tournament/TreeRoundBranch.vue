<script setup lang="ts">
import type { StyleValue } from 'vue';
// Fix Later: Get gap value from parent. Don't compute from parent.

const props = defineProps<{
  height: number
  direction: 'up' | 'down'
}>();

const height = computed(() => {
  return props.height / 2;
});

const computeStyle = computed<StyleValue>(() => {
  const style: StyleValue = {
    right: '-40px',
  };
  style[props.direction === 'down' ? 'top' : 'bottom'] = `${props.height - 5}px`;

  return style;
});
</script>

<template>
  <div absolute :style="computeStyle">
    <svg
      v-if="direction === 'down'"
      width="40" :height="height * 2"
      :viewBox="`0 0 40 ${height * 2}`"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      dark:stroke-white stroke-gray
    >
      <path
        :d="`
          M 0 0
          c 20 0 20 ${height} 20 ${height}
          c 0 ${height} 20 ${height} 20 ${height}`" stroke-width="2"
      />
    </svg>
    <svg
      v-else
      :height="height * 2"
      :viewBox="`0 0 40 ${height * 2}`"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      dark:stroke-white stroke-gray stroke-width="2"
    >
      <path
        :transform="`scale(1, -1) translate(0, -${height * 2})`"
        :d="`
          M 0 0
          c 20 0 20 ${height} 20 ${height}
          c 0 ${height} 20 ${height} 20 ${height}`"
      />
    </svg>
  </div>
</template>

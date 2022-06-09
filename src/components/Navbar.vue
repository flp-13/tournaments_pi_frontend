<script setup lang="ts">
import { isDark, toggleDark } from '~/composables';

</script>
<template>
  <nav>
    <router-link :to="'/'" class="nav-header">Tournaments-PI</router-link>
    <div flex gap-5 m="l-auto">
      <button btn @click="toggleDark()">
        <div v-if="isDark" i-carbon-moon />
        <div v-else i-carbon-sun />
      </button>
    </div>
  </nav>
</template>
<style scoped lang="scss">
nav{
  @apply h-15 w-screen shadow dark:shadow-brand-primary shadow-lg flex items-center xl:px-50;

  .nav-header{
    @apply font-bold text-2xl
  }
}
</style>
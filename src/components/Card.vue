<script setup lang="ts">

</script>
<template>
<div class="card">
  <h1 v-if="$slots.title" class="card-title">
    <slot name="title">
    </slot>
  </h1>
  <div class="card-body">
    <slot></slot>
  </div>
  <div class="card-footer" v-if="$slots.footer">
    <slot name="footer"></slot>
  </div>
</div>
</template>
<style scoped lang="scss">
.card{
  @apply shadow-lg dark:shadow-brand-primary inline-block py-3 px-4;
  
  .card-title{
    @apply text-2xl py-2 px-1 font-semibold relative;

    &::after{
      content: ' ';
      height: 0.1rem;
      width: 100%;
      @apply absolute bottom-1 left-0 shadow bg-gray-500 dark:shadow-brand-primary dark:bg-brand-primary
    }
  }
  
  .card-body{
    @apply mt-2
  }

  .card-footer{
    @apply mt-3 pt-3 relative;

    &::after{
      content: ' ';
      height: 0.05rem;
      width: 100%;
      opacity: 0.5;
      @apply absolute top-0 left-0 bg-gray-500 dark:bg-brand-primary
    }
  }
}
</style>
<script setup lang="ts">
import type { Tournament } from '~/types'

defineProps<{
  tournament?: Tournament | null
}>();

defineEmits<{
  (event: 'edit', tournament: Tournament): void,
  (event: 'delete', id: number): void
}>();
</script>

<template>
  <Card md:w-150 w-full v-if="tournament">
    <template #title>
      {{ tournament.name }}
    </template>
    <p v-if="tournament.description">
      {{ tournament.description }}
    </p>
    <p v-else italic>
      No Description
    </p>
    <template #footer>
      <div class="flex gap-3 flex-row-reverse justify-right">
        <router-link :to="`/tournaments/${tournament.id}`">
          <Button class="btn btn-brand-primary h-3.25rem w-3.25rem">
            <div i-carbon-decision-tree />
          </Button>
        </router-link>
        <Button class="btn btn-theme-warning h-3.25rem w-3.25rem" @click="$emit('edit', tournament!)">
          <div i-carbon-pen />
        </Button>
        <Button class="btn btn-theme-danger h-3.25rem w-3.25rem" @click="$emit('delete', tournament!.id!)">
          <div i-carbon-trash-can />
        </Button>
      </div>
    </template>
  </Card>
  <Card md:w-150 w-full v-else>
    <template #title>
      <Skeletor bg-red-400 height="2rem" width="100%" />
    </template>
    <p class="flex flex-col gap-1">
      <Skeletor bg-red-400 height="1.4rem" width="100%" />
      <Skeletor bg-red-400 height="1.4rem" width="100%" />
      <Skeletor bg-red-400 height="1.4rem" width="100%" />
      <Skeletor bg-red-400 height="1.4rem" width="30%" />
    </p>
    <template #footer>
      <div flex gap-3 flex-row-reverse justify-right>
        <Skeletor rounded height="3.25rem" width="3.25rem" />
        <Skeletor rounded height="3.25rem" width="3.25rem" />
        <Skeletor rounded height="3.25rem" width="3.25rem" />
      </div>
    </template>
  </Card>
</template>

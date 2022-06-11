<script setup lang="ts">
import type { Player } from '~/types';

defineProps<{
  player?: Player | null
}>();

defineEmits<{
  (event: 'edit', player: Player): void
  (event: 'delete', id: number): void
}>();
</script>

<template>
  <Card v-if="player" md:w-170 w-full mx-2>
    <div flex items-center>
      <div>{{ player.name }}</div>
      <div ml-auto flex gap-3>
        <Button class="btn btn-theme-warning" h-3rem w-3rem @click="$emit('edit', player!)">
          <div i-carbon-pen />
        </Button>
        <Button class="btn btn-theme-danger" h-3rem w-3rem @click="$emit('delete', player!.id!)">
          <div i-carbon-trash-can />
        </Button>
      </div>
    </div>
  </Card>
  <Card v-else md:w-170 w-full mx-2>
    <div flex items-center>
      <div flex-grow>
        <Skeletor height="2rem" width="70%" />
      </div>
      <div ml-auto flex gap-3>
        <Skeletor height="3rem" width="3rem" />
        <Skeletor height="3rem" width="3rem" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Player } from '~/types';

const props = defineProps<{
  players: Player[]
}>();

const emit = defineEmits<{
  (event: 'changedSelection', player: Player | null): void
  (event: 'randomizePlayers'): void
}>();

const selected = ref<number | null>(null);

watch(() => selected.value, () => {
  emit('changedSelection', props.players.find(x => x.id === selected.value) ?? null);
});
</script>

<template>
  <Card w-75>
    <template #title>
      <h2>Remaining Players</h2>
    </template>
    <div flex flex-col>
      <div
        v-for="player in players" :key="player.id ?? 0" py-2 pl-3 flex gap-3
        :class="{ 'dark:bg-dark-300 bg-light-800': selected === player.id }"
      >
        <input :id="`remaining-${player.id}`" v-model="selected" type="radio" name="remainingPlayer" :value="player.id" />
        <label :for="`remaining-${player.id}`">{{ player.name }}</label>
      </div>
    </div>
    <template #footer>
      <div flex gap-3>
        <Button class="btn btn-theme-danger" :disabled="!selected" @click="selected = null">
          Cancel
        </Button>
        <Button class="btn btn-theme-warning" @click="$emit('randomizePlayers')">
          Randomize
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Bracket } from '~/types';

const props = defineProps<{
  selected: Bracket | null
}>();

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'declareWinner', bracket: Bracket, winnerBracket: Bracket): void
}>();

function handleClose() {
  emit('close');
}

function declareWinner(bracket: Bracket | null) {
  if (bracket && props.selected)
    emit('declareWinner', props.selected, bracket);
}
</script>

<template>
  <Modal :show="!!selected" @close="handleClose">
    <template #title>
      Declare Winner
    </template>
    <div flex gap-5 items-center text-center my-4>
      <div class="w-48%">
        <div class="text-xl">
          {{ selected?.prev_match?.left.player?.name }}
        </div>
        <Button class="btn btn-theme-warning text-2xl mt-3" @click="declareWinner(selected?.prev_match?.left ?? null)">
          <div i-carbon-trophy />
        </Button>
      </div>
      <div class="w-4% text-3xl">
        VS
      </div>
      <div class="w-48%">
        <div class="text-xl">
          {{ selected?.prev_match?.right.player?.name }}
        </div>
        <Button class="btn btn-theme-warning text-2xl mt-3" @click="declareWinner(selected?.prev_match?.right ?? null)">
          <div i-carbon-trophy />
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue';
import type { Bracket, Player } from '~/types';

const props = defineProps<{
  bracket: Bracket | null
  isLastRound: boolean
  inputingPlayer: Player | null
  tournamentStarted: boolean
}>();

const emit = defineEmits<{
  (event: 'placedPlayer', player: Player, bracketId: number, cb: () => void): void
  (event: 'fillWithPlayer', bracket: Bracket): void
  (event: 'declareWinner', bracket: Bracket): void
}>();

const placingPlayer = ref(false);

function placePlayer() {
  if (props.inputingPlayer && props.bracket?.match === null) {
    placingPlayer.value = true;
    emit('placedPlayer', props.inputingPlayer, props.bracket!.id!, () => {
      placingPlayer.value = false;
    });
    return;
  }
  if (props.bracket?.match === null)
    fillWithPlayer();
  if (props.bracket?.match && props.bracket?.match > 0 && !props.bracket.player_id && props.tournamentStarted && props.bracket.prev_match?.left.player_id && props.bracket.prev_match?.right.player_id)
    declareWinner();
}

function declareWinner() {
  emit('declareWinner', props.bracket!);
}

function fillWithPlayer() {
  emit('fillWithPlayer', props.bracket!);
}

const computeNullStyle = computed<StyleValue>(() => {
  return {
    visibility: props.bracket === null ? 'hidden' : 'visible',
    pointerEvents: props.bracket === null ? 'none' : 'auto',
  };
});

const computeClasses = computed<string[]>(() => {
  const unavailable = 'dark:bg-dark-400 bg-gray-500';
  const hovered = 'hover:dark:bg-dark-200 hover:bg-gray-400 cursor-pointer';
  const neutral = 'dark:bg-dark-300 bg-gray-300';

  if (props.tournamentStarted) {
    if (props.bracket?.match === null)
      return unavailable.split(' ');
    else if (props.bracket?.player_id)
      return neutral.split(' ');
    else
      return `${neutral} ${hovered}`.split(' ');
  }
  else {
    if (props.inputingPlayer && props.bracket?.match === null)
      return `${neutral} ${hovered}`.split(' ');
    else if (props.bracket?.match === null)
      return `${neutral} ${hovered}`.split(' ');
    else
      return unavailable.split(' ');
  }
});
</script>

<template>
  <div
    class="color-black dark:color-white flex items-center px-3 transition"
    :style="computeNullStyle"
    :class="computeClasses"
    @click="placePlayer"
  >
    <span>{{ bracket?.player?.name }}</span>
  </div>
</template>

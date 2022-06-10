<script setup lang="ts">
import type { Bracket, Player } from '~/types';

defineProps<{
  round: Array<Bracket | null>
  roundNum: number
  inputingPlayer: Player | null
  tournamentStarted: boolean
}>();

defineEmits<{
  (event: 'placedPlayer', player: Player, bracketId: number, cb: () => void): Promise<boolean>
  (event: 'fillWithPlayer', bracket: Bracket): void
}>();

const gap = 10;
const bracketHeight = 40;
const bracketWidth = 225;

function wrapperHeight(r: number): number {
  if (r <= 0)
    return bracketHeight;

  return wrapperHeight(r - 1) * 2 + gap;
}
</script>

<template>
  <div flex flex-col :style="{ gap: `${gap}px` }">
    <div v-for="(bracket, i) in round" :key="bracket?.id ?? i" grid place-items-center :style="{ height: `${wrapperHeight(roundNum)}px` }" relative>
      <TreeRoundBracket
        :tournament-started="tournamentStarted"
        :inputing-player="inputingPlayer"
        :style="{ height: `${bracketHeight}px`, width: `${bracketWidth}px` }"
        :bracket="bracket"
        :is-last-round="round.length === 1"
        @placed-player="(player, bracketId, cb) => $emit('placedPlayer', player, bracketId, cb)"
        @fill-with-player="(bracket) => $emit('fillWithPlayer', bracket)"
      />
      <TreeRoundBranch v-if="bracket !== null && round.length > 1" :height="wrapperHeight(roundNum) / 2 + gap / 2" :direction="i % 2 === 0 ? 'down' : 'up'" />
    </div>
  </div>
</template>

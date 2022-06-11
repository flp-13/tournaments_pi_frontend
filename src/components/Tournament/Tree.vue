<script setup lang="ts">
import type { Bracket, Player } from '~/types';

defineProps<{
  rounds: Array<Array<Bracket | null>>
  inputingPlayer: Player | null
  tournamentStarted: boolean
}>();

defineEmits<{
  (event: 'placedPlayer', player: Player, bracketId: number, cb: () => void): Promise<boolean>
  (event: 'fillWithPlayer', bracket: Bracket): void
  (event: 'declareWinner', bracket: Bracket): void
}>();
</script>

<template>
  <div flex gap-40px overflow-auto>
    <TreeRound
      v-for="(round, i) in rounds" :key="i"
      :inputing-player="inputingPlayer" :round="round" :round-num="+i"
      :tournament-started="tournamentStarted"
      @placed-player="(player, bracketId, cb) => $emit('placedPlayer', player, bracketId, cb)"
      @fill-with-player="(bracket) => $emit('fillWithPlayer', bracket)"
      @declare-winner="(bracket) => $emit('declareWinner', bracket)"
    />
  </div>
</template>

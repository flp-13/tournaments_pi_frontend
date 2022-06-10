<script setup lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash';
import { useToast } from 'vue-toastification';
import { bfsBracketTree } from '~/helpers';
import type { APIBrackets, Bracket, Player, Tournament } from '~/types'

const props = defineProps<{
  tournament: number
}>();

const router = useRouter();
const tournament = ref<Tournament | null>(null);
const selectedRemainingPlayer = ref<Player | null>(null);
const selectedFillBracket = ref<Bracket | null>(null);
const selectedWinnerBracket = ref<Bracket | null>(null);
const toast = useToast();
const state = reactive<APIBrackets>({
  brackets: null,
  added_players: [],
  remaining_players: [],
  total_players: 0,
  total_rounds: 0,
});

axios.get<Tournament>(`/tournaments/${props.tournament}`)
  .then((res) => {
    tournament.value = res.data;
    axios.get<APIBrackets>(`/tournaments/${props.tournament}/brackets`)
      .then((res) => {
        if (res.status === 204) {
          state.brackets = {};
          return;
        }
        Object.assign(state, res.data);
      });
  });

function createBrackets() {
  axios.put<APIBrackets>(`/tournaments/${props.tournament}/brackets?empty=true`)
    .then((res) => {
      Object.assign(state, res.data);
    });
}

function handleRandomizedBracket() {
  axios.put<APIBrackets>(`/tournaments/${props.tournament}/brackets`)
    .then((res) => {
      Object.assign(state, res.data);
    });
}

function handlePlacePlayer(player: Player, bracketId: number, cb: () => void) {
  axios.put(`/brackets/${bracketId}/player`, {
    player_id: player.id,
  }).then(() => {
    const bracket = bfsBracketTree(state.brackets!, bracketId);

    if (bracket) {
      bracket.player_id = player.id;
      bracket.player = player;
    }
    state.remaining_players = state.remaining_players?.filter(x => x.id !== player.id);
    state.added_players?.push(player);
    selectedRemainingPlayer.value = null;

    cb();
  });
}

function handleFillBracket(bracket: Bracket) {
  selectedFillBracket.value = bracket;
}

function handleFill(player: Player) {
  if (selectedFillBracket.value) {
    axios.put(`/brackets/${selectedFillBracket.value.id}/player`, {
      player_id: player.id,
    }).then((_) => {
      const bracket = bfsBracketTree(state.brackets ?? {}, selectedFillBracket.value!.id!);
      if (bracket) {
        bracket.player = player;
        bracket.player_id = player.id;
        selectedFillBracket.value = null;
        state.added_players?.push(player);
        state.remaining_players = state.remaining_players?.filter(x => x.id !== player.id);
      }
    });
  }
}

function handleSwitch(player: Player) {
  if (selectedFillBracket.value) {
    axios.put(`/brackets/${selectedFillBracket.value.id}/player`, {
      player_id: player.id,
    }).then((_) => {
      const bracket = bfsBracketTree(state.brackets ?? {}, selectedFillBracket.value!.id!);
      const targetBracket = bfsBracketTree(state.brackets ?? {}, player.id, 'player_id');
      if (bracket && targetBracket) {
        bracket.player_id = targetBracket.player_id;
        bracket.player = targetBracket.player;

        targetBracket.player_id = selectedFillBracket.value?.player_id;
        targetBracket.player = selectedFillBracket.value?.player;

        selectedFillBracket.value = null;
      }
    });
  }
}

function handleStartTournament() {
  if (tournament.value) {
    axios.put(`/tournaments/${tournament.value.id}/start`)
      .then(() => {
        tournament.value!.started = true;
      })
      .catch((res: AxiosError) => {
        toast.error((res.response!.data as any).message, {
          timeout: 6000,
        })
      });
  }
}

function handleOpenDeclareBracket(bracket: Bracket) {
  selectedWinnerBracket.value = bracket;
}

function handleDeclareWinner(a: Bracket, winner: Bracket) {
  axios.put(`tournaments/${props.tournament}/matches/${a.match}/winner`, {
    player_id: winner.player_id,
  }).then((res) => {
    const bracket = bfsBracketTree(state.brackets ?? {}, a.id);
    if (bracket) {
      bracket.player_id = winner.player_id;
      bracket.player = winner.player;
      selectedWinnerBracket.value = null;
    }
  });
}

const rounds = computed<Array<Array<Bracket | null>>>(() => {
  if (!state.brackets || isEmpty(state.brackets))
    return [];

  let a: Array<Bracket | null> = [state.brackets];
  let b: Array<Bracket | null> = [];
  const rounds: Array<Array<Bracket | null>> = [[]];
  let round = 0;

  while (a.length > 0) {
    const bracket = cloneDeep(a[0]);
    if (bracket) {
      b.push(bracket.prev_match?.left ?? null, bracket.prev_match?.right ?? null);
      rounds[round].push(bracket);
    }
    else {
      rounds[round].push(null);
    }
    a.shift();
    if (a.length === 0 && b.length > 0) {
      round++;
      rounds.push([]);
      a = [...b];
      b = [];
    }
  }
  rounds.pop();
  for (let i = 0; i < rounds.length; i++) {
    for (let j = 0; j < rounds[i].length; j++) {
      delete rounds[i][j]?.prev_match?.left.prev_match;
      delete rounds[i][j]?.prev_match?.right.prev_match;
    }
  }
  rounds.reverse();
  return rounds;
});
</script>

<template>
  <div container mx-auto px-4>
    <template v-if="tournament">
      <div class="flex items-center text-2xl gap-2">
        <button i-carbon-caret-left @click="router.back()" />
        <h1>{{ tournament.name }}</h1>
      </div>
      <hr class="my-4">
      <div class="flex">
        <router-link v-if="!tournament.started" class="mr-auto" :to="`/tournaments/${tournament.id}/players`">
          <Button class="btn btn-brand-primary md:block hidden">
            Configure Players
          </Button>
          <Button class="btn btn-brand-primary md:hidden block h-3rem w-3rem">
            <div i-carbon-user-multiple />
          </Button>
        </router-link>
        <div class="flex gap-5 ml-auto">
          <Button v-if="state.brackets !== null" class="btn" @click="createBrackets">
            {{ rounds.length > 0 ? 'Recreate' : 'Create' }} Brackets
          </Button>
          <Button :disabled="tournament.started" class="btn btn-theme-warning" @click="handleStartTournament">
            {{ tournament.started ? (state.brackets?.player_id ? "Tournament Finished" : "Tournament Started") : "Start Tournament" }}
          </Button>
        </div>
      </div>
      <div flex gap-3 mt-5>
        <Tree
          v-if="rounds.length > 0" mt-10 :rounds="rounds" flex-grow
          :inputing-player="selectedRemainingPlayer"
          :tournament-started="!!tournament.started"
          @placed-player="handlePlacePlayer"
          @fill-with-player="handleFillBracket"
          @declare-winner="handleOpenDeclareBracket"
        />
        <RemainingPlayers
          v-if="!tournament.started && state.remaining_players && state.remaining_players.length > 0"
          :players="state.remaining_players"
          @randomize-players="handleRandomizedBracket"
          @changed-selection="(player) => selectedRemainingPlayer = player"
        />
      </div>
    </template>
  </div>
  <EditBracketModal
    :selected="selectedFillBracket"
    :added-players="state.added_players ?? []"
    :remaining-players="state.remaining_players ?? []"
    @close="selectedFillBracket = null"
    @fill="handleFill"
    @switch="handleSwitch"
  />
  <DeclareWinnerModal
    :selected="selectedWinnerBracket"
    @close="selectedWinnerBracket = null"
    @declare-winner="handleDeclareWinner"
  />
</template>

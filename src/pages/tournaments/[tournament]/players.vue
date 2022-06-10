<script setup lang="ts">
import axios from 'axios'
import { pick } from 'lodash';
import type { PaginationAPI, Player, Tournament } from '~/types'

const props = defineProps<{
  tournament: number
}>()
const tournament = ref<Tournament | null>(null);
const state = reactive<PaginationAPI<Player>>({
  count: 0,
  next_page: null,
  prev_page: null,
  results: null,
  total_pages: 0,
});
const router = useRouter();
const showModal = ref(false);
const playerForm = reactive({
  id: null,
  name: '',
});
const submitting = ref(false);

function getData() {
  axios.get<PaginationAPI<Player>>(`/tournaments/${props.tournament}/players`)
    .then((res) => {
      Object.assign(state, res.data);
    });
}

axios.get<Tournament>(`/tournaments/${props.tournament}`)
  .then((res) => {
    tournament.value = res.data;
    getData();
  });

function handleSubmit() {
  if (!tournament.value)
    return;
  submitting.value = true;
  if (playerForm.id) {
    axios.put(`/players/${playerForm.id}`, pick(playerForm, ['name']))
      .then(() => {
        const player = state.results?.find(x => x.id === playerForm.id);
        Object.assign(player, playerForm);
        showModal.value = false;
        handleCloseModal();
        submitting.value = false;
      });
    return;
  }

  axios.post<Player>(`/tournaments/${tournament.value.id}/players`, pick(playerForm, ['name']))
    .then((res) => {
      state.results?.unshift(res.data);
      handleCloseModal();
      Object.assign(playerForm, { name: '' });
      submitting.value = false;
    });
}

function handleDelete(id: number) {
  axios.delete(`/players/${id}`)
    .then(() => {
      getData();
    });
}

function handleShowEdit(player: Player) {
  Object.assign(playerForm, pick(player, ['id', 'name']));
  showModal.value = true;
}

function handleCloseModal() {
  showModal.value = false
}

function handleClosedModal() {
  Object.assign(playerForm, {
    id: null,
    name: '',
  })
}
</script>

<template>
  <div v-if="tournament" container mx-auto px-4>
    <div text-2xl flex gap-1>
      <button i-carbon-caret-left @click="router.back()" />
      <h1>Configure Players: {{ tournament.name }}</h1>
    </div>
    <hr my-4>
    <div text-center>
      <Button class="btn btn-brand-primary" @click="showModal = true">
        Add Player
      </Button>
    </div>
    <div v-if="state.results" flex flex-col gap-3 mt-3 items-center w-full>
      <Player v-for="player in state.results" :key="player.id ?? 0" :player="player" @edit="handleShowEdit" @delete="handleDelete" />
    </div>
    <div v-else flex flex-col gap-3 mt-3 items-center w-full>
      <Player v-for="i in 5" :key="`skeleton${i}`" />
    </div>
    <Modal :show="showModal" is-form @close="showModal = false" @submit="handleSubmit" @closed="handleClosedModal">
      <template #title>
        {{ playerForm.id ? 'Edit' : 'Add' }} Player
      </template>
      <Input v-model="playerForm.name" label="Player Name" type="text" name="name" />
      <template #footer>
        <div class="flex">
          <Button class="ml-auto btn btn-brand-primary" type="submit" :loading="submitting">
            Submit Player
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

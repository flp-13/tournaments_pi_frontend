<script setup lang="ts">
import axios from 'axios'
import { pick } from 'lodash'
import type { PaginationAPI, Tournament } from '~/types'

document.title = 'Tournament PI'
const state = reactive<PaginationAPI<Tournament>>({
  count: 0,
  next_page: null,
  prev_page: null,
  results: null,
  total_pages: 0,
})
const showAddTournament = ref(false)
const tournamentForm = reactive<Tournament>({
  id: null,
  name: '',
  description: '',
})
const submitting = ref(false);

function getData() {
  axios.get<PaginationAPI<Tournament>>('/tournaments')
    .then((res) => {
      Object.assign(state, res.data)
    })
}

getData()

function handleSubmit() {
  submitting.value = true;
  if (tournamentForm.id) {
    axios.put(`/tournaments/${tournamentForm.id}`, pick(tournamentForm, ['name', 'description']))
      .then((res) => {
        if (state.results) {
          const edited = state.results.find(x => x.id === tournamentForm.id)
          Object.assign(edited, tournamentForm)
          handleCloseModal()
          submitting.value = false;
        }
      })
    return
  }
  axios.post<Tournament>('/tournaments', tournamentForm)
    .then((res) => {
      if (state.results === null) {
        state.results = [res.data]
        return
      }
      state.results.unshift(res.data)
      handleCloseModal()
      submitting.value = false;
    })
}

function handleShowEdit(tournament: Tournament) {
  showAddTournament.value = true
  Object.assign(tournamentForm, pick(tournament, ['id', 'name', 'description']))
}

function handleDelete(id: number) {
  axios.delete(`/tournaments/${id}`)
    .then(() => {
      getData();
    })
}

function handleCloseModal() {
  showAddTournament.value = false
}

function handleClosedModal() {
  Object.assign(tournamentForm, {
    id: null,
    name: '',
    description: '',
  })
}
</script>

<template>
  <div>
    <div class="text-center">
      <Button class="btn btn-brand-primary" @click="showAddTournament = true">
        Add Tournament
      </Button>
    </div>
    <div class="w-full flex justify-center mt-5 md:px-0 px-3">
      <div v-if="state.results !== null" flex flex-col gap-5>
        <TournamentCard
          v-for="tournament in state.results"
          :key="tournament.id ?? 0"
          :tournament="tournament"
          @edit="handleShowEdit"
          @delete="handleDelete"
        />
      </div>
      <div v-else flex flex-col gap-5>
        <TournamentCard v-for="i in 5" :key="`skeleton-${i}`" />
      </div>
    </div>
  </div>
  <Modal :show="showAddTournament" is-form @close="handleCloseModal" @submit="handleSubmit" @closed="handleClosedModal">
    <template #title>
      {{ tournamentForm.id ? 'Edit' : 'Add' }} Tournament
    </template>
    <Input v-model="tournamentForm.name" label="Tournament Title" type="text" name="title" />
    <AutosizeTextarea v-model="tournamentForm.description" label="Tournament Description" rows="1" class="text-black" />
    <template #footer>
      <div class="flex">
        <Button class="ml-auto btn btn-brand-primary" type="submit" :loading="submitting">
          Submit Tournament
        </Button>
      </div>
    </template>
  </Modal>
</template>

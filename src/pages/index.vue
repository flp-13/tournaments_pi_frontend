<script setup lang="ts">
import axios from 'axios';
import { pick } from 'lodash';
import type { PaginationAPI, Tournament } from '~/types';

document.title = "Tournament PI";
const state = reactive<PaginationAPI<Tournament>>({
  count: 0,
  next_page: null,
  prev_page: null,
  results: null,
  total_pages: 0
});
const showAddTournament = ref(false);
const tournamentForm = reactive<Tournament>({
  id: null,
  name: "",
  description: ""
});

function getData(){
  axios.get<PaginationAPI<Tournament>>('/tournaments')
    .then((res) => {
      Object.assign(state, res.data);
    });
}

getData();

function handleSubmit(){
  if(tournamentForm.id){
    axios.put(`/tournaments/${tournamentForm.id}`, pick(tournamentForm, ['name', 'description']))
      .then((res) => {
        if(state.results){
          const edited = state.results.find(x => x.id === tournamentForm.id);
          Object.assign(edited, tournamentForm);
          handleCloseModal();
        }
      });
    return;
  }
  axios.post<Tournament>('/tournaments', tournamentForm)
    .then((res) => {
      if(state.results === null){
        state.results = [res.data];
        return;
      }
      state.results.unshift(res.data);
      handleCloseModal();
    });
}

function handleShowEdit(tournament: Tournament){
  showAddTournament.value = true;
  Object.assign(tournamentForm, pick(tournament, ['id', 'name', 'description']));
}

function handleDelete(id: number){
  axios.delete(`/tournaments/${id}`)
    .then(() => {
      getData();
    });
}

function handleCloseModal(){
  showAddTournament.value = false;
  Object.assign(tournamentForm, {
    id: null,
    name: "",
    description: ""
  });
}

</script>
<template>
  <div>
    <div class="text-center">
      <Button class="btn btn-brand-primary" @click="showAddTournament = true">Add Tournament</Button>
    </div>
    <div class="w-full flex justify-center mt-5 md:px-0 px-3">
      <div v-if="state.results !== null" flex flex-col gap-5>
        <Card md:w-150 w-full v-for="tournament in state.results">
          <template #title>{{ tournament.name }}</template>
          <p v-if="tournament.description">
            {{ tournament.description }}
          </p>
          <p italic v-else>
            No Description
          </p>
          <template #footer>
            <div class="flex gap-3 flex-row-reverse justify-right">
              <router-link :to="`/tournaments/${tournament.id}`">
                <Button class="btn btn-brand-primary h-3.25rem w-3.25rem">
                  <div i-carbon-decision-tree />
                </Button>
              </router-link>
              <Button class="btn btn-theme-warning h-3.25rem w-3.25rem" @click="handleShowEdit(tournament)">
                <div i-carbon-pen />
              </Button>
              <Button class="btn btn-theme-danger h-3.25rem w-3.25rem" @click="handleDelete(tournament.id!)">
                <div i-carbon-trash-can />
              </Button>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
  <Modal :show="showAddTournament" @close="handleCloseModal" is-form @submit="handleSubmit">
    <template #title>Add Tournament</template>
    <Input label="Tournament Title" type="text" name="title" v-model="tournamentForm.name" />
    <AutosizeTextarea label="Tournament Description" rows="1" class="text-black" v-model="tournamentForm.description" />
    <template #footer>
      <div class="flex">
        <Button class="ml-auto btn btn-brand-primary" type="submit">
          Submit Tournament
        </Button>
      </div>
    </template>
  </Modal>
</template>

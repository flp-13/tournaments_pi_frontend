<script setup lang="ts">
// import type { AxiosError } from 'axios';
import axios from 'axios'
import type { PaginationAPI, Tournament } from '~/types'

document.title = 'Tournament PI'
const state = reactive<PaginationAPI<Tournament>>({
  count: 0,
  next_page: null,
  prev_page: null,
  results: null,
  total_pages: 0,
})

function getData() {
  axios.get<PaginationAPI<Tournament>>('/tournaments')
    .then((res) => {
      Object.assign(state, res.data)
    })
}

getData();
</script>

<template>
  <div class="w-full flex justify-center mt-5 md:px-0 px-3">
    <div v-if="state.results !== null" flex flex-col gap-5>
      <TournamentCard
        v-for="tournament in state.results"
        :key="tournament.id ?? 0"
        :tournament="tournament"
      />
    </div>
    <div v-else flex flex-col gap-5>
      <TournamentCard v-for="i in 5" :key="`skeleton-${i}`" />
    </div>
  </div>
</template>

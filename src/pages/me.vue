<script setup lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios';
import { pick } from 'lodash';
import { useToast } from 'vue-toastification';
import { useUser } from '~/stores/useUser';
import type { PaginationAPI, Tournament, User } from '~/types';

const user = useUser();
const router = useRouter();
const toast = useToast();
const loadingAuth = ref(true);
const showTournamentModal = ref(false);
const myProfile = ref<{
  username: string
  email: string
}>({
  username: '',
  email: '',
});
const tournamentForm = reactive<Tournament>({
  id: null,
  name: '',
  description: '',
});

const tournamentState = reactive<PaginationAPI<Tournament>>({
  count: 0,
  next_page: null,
  prev_page: null,
  results: null,
  total_pages: 0,
});

if (!user.id) {
  loadingAuth.value = false;
  router.replace('/');
}
else {
  getData();
}

user.$subscribe((_, state) => {
  if (!state.id) {
    router.push('/');
    loadingAuth.value = false;
  }
  getData();
});

function getData() {
  axios.get<User>('/me')
    .then((res) => {
      myProfile.value.username = res.data.name ?? '';
      myProfile.value.email = res.data.email ?? '';
    });
  axios.get<PaginationAPI<Tournament>>(`tournaments?user=${user.id}`)
    .then((res) => {
      Object.assign(tournamentState, res.data);
    });
}

function handleEditProfile() {
  axios.put<any>('/me', myProfile.value)
    .then((res) => {
      localStorage.setItem('token', res.data.token);
      user.name = myProfile.value?.username ?? '';
      axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    });
}

function handleChangePassword(form: any, cb?: () => void) {
  axios.put('/me/password', form)
    .then(() => {
      toast.success('Password changed');
      if (cb)
        cb();
    });
}

function handleAddTournament() {
  tournamentForm.name = tournamentForm.description = '';
  showTournamentModal.value = true;
}

function handleTournamentSubmit(form: any, cb?: () => void) {
  if (form.id) {
    axios.put(`/tournaments/${form.id}`, pick(form, ['name', 'description']))
      .then((res) => {
        // if (state.results) {
        //   const edited = state.results.find(x => x.id === form.id)
        //   Object.assign(edited, form)
        //   handleCloseModal()
        //   submitting.value = false;
        // }
      })
    return
  }
  axios.post<Tournament>('/tournaments', form)
    .then((res) => {
      if (tournamentState.results === null) {
        tournamentState.results = [res.data];
        return;
      }
      tournamentState.results.unshift(res.data);
      handleCloseModal();
    })
    .catch((res: AxiosError<any>) => {
      toast.error(res.response?.data.message);
    })
    .finally(() => {
      if (cb)
        cb();
    });
}

function handleCloseModal() {
  tournamentForm.name = tournamentForm.description = '';
  showTournamentModal.value = false;
}

function handleShowEdit(tournament: Tournament) {
  showTournamentModal.value = true
  Object.assign(tournamentForm, pick(tournament, ['id', 'name', 'description']))
}

function handleDelete(id: number) {
  axios.delete(`/tournaments/${id}`)
    .then(() => {
      getData();
    });
}
</script>

<template>
  <div container mx-auto>
    <h1 class="text-2xl">
      My Profile
    </h1>
    <hr my-3 />
    <template v-if="myProfile">
      <form @submit.prevent="handleEditProfile">
        <Input v-model="myProfile.username" label="Username" name="username" />
        <Input v-model="myProfile.email" label="Email" name="email" />
        <Button class="btn btn-theme-warning" type="submit">
          Edit
        </Button>
        <ChangePasswordModalBtn @submit="handleChangePassword" />
      </form>
    </template>
    <h2 class="text-2xl">
      My Tournaments
    </h2>
    <hr my-3 />
    <div class="text-center">
      <Button class="btn btn-brand-primary" @click="handleAddTournament">
        Add Tournament
      </Button>
    </div>
    <div class="mt-5 flex flex-col items-center gap-5">
      <template v-if="tournamentState.results">
        <template v-if="tournamentState.results.length > 0">
          <TournamentCard
            v-for="tournament in tournamentState.results"
            :key="tournament.id ?? 0"
            :tournament="tournament"
            with-actions
            @edit="handleShowEdit"
            @delete="handleDelete"
          />
        </template>
        <div v-else text-center>
          No Tournaments Found
        </div>
      </template>
      <template v-else>
        <TournamentCard v-for="i in 4" :key="i" :tournament="null" />
      </template>
    </div>
  </div>
  <TournamentFormModal
    :show="showTournamentModal" :tournament="tournamentForm"
    @close="showTournamentModal = false" @submit="handleTournamentSubmit"
  />
</template>

<script setup lang="ts">
import axios from 'axios';
import { useToast } from 'vue-toastification';
import type { User } from '~/types';
import { isDark, toggleDark } from '~/composables';
import { useUser } from '~/stores/useUser';

const showLogin = ref(false);
const loginModal = ref();
const showRegister = ref(false);
const registerModal = ref();

const toast = useToast();
const user = useUser();

function setLogin(token: string, newUser: User) {
  localStorage.setItem('token', token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  Object.assign(user, newUser);
}

function handleRegister(form: any) {
  axios.post<any>('/register', form)
    .then((res) => {
      setLogin(res.data.token, res.data.user);
      registerModal.value.resetForm();
      showRegister.value = false;
    })
    .catch((res) => {
      toast.error(res.response.data.message);
      if (res.response?.status === 401) {
        toast.error(res.response?.data.message, {
          timeout: 3000,
        });
      }
    });
}

function handleLogin(form: any) {
  axios.post<any>('/login', form)
    .then((res) => {
      setLogin(res.data.token, res.data.user);
      loginModal.value.resetForm();
      showLogin.value = false;
    })
    .catch((res) => {
      toast.error(res.response.data.message);
      if (res.response?.status === 401) {
        toast.error(res.response?.data.message, {
          timeout: 3000,
        });
      }
    });
}

function handleLogout() {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common.Authorization;
  user.$reset();
}
</script>

<template>
  <nav class="fixed top-0 dark:bg-#121212 bg-white z-2">
    <router-link to="/" class="nav-header">
      Tournaments-PI
    </router-link>
    <div flex gap-5 ml-auto>
      <div v-if="!user.id" flex gap-5>
        <Button class="btn btn-brand-primary" @click="showLogin = true">
          Login
        </Button>
        <Button class="btn btn-brand-primary" @click="showRegister = true">
          Register
        </Button>
      </div>
      <div v-else flex gap-5>
        <router-link to="/me">
          <Button class="btn btn-brand-primary">
            Dashboard
          </Button>
        </router-link>
        <Button class="btn btn-theme-danger" @click="handleLogout">
          Logout
        </Button>
      </div>
      <button btn @click="toggleDark()">
        <div v-if="isDark" i-carbon-moon />
        <div v-else i-carbon-sun />
      </button>
    </div>
  </nav>
  <LoginModal ref="loginModal" :show="showLogin" @close="showLogin = false" @submit="handleLogin" />
  <RegisterModal ref="registerModal" :show="showRegister" @close="showRegister = false" @submit="handleRegister" />
</template>

<style scoped lang="scss">
nav{
  @apply h-15 w-screen shadow dark:shadow-brand-primary shadow-lg flex items-center xl:px-50 lg:px-25 md:px-15 px-5;

  .nav-header{
    @apply font-bold text-2xl
  }
}
</style>

<script setup lang="ts">
import axios from 'axios';
import { isDark, toggleDark } from '~/composables';

const showLogin = ref(false);
const showRegister = ref(false);

function handleRegister(form: any) {
  axios.post('/register', form)
    .then(() => {

    });
}

function handleLogin(form: any) {
  axios.post('/login', form, {
    headers: {
      'With-Credentials': true,
    },
  }).then(() => {

  });
}
</script>

<template>
  <nav class="fixed top-0 dark:bg-#121212 bg-white z-2">
    <router-link to="/" class="nav-header">
      Tournaments-PI
    </router-link>
    <div flex gap-5 ml-auto>
      <Button class="btn btn-brand-primary" @click="showLogin = true">
        Login
      </Button>
      <Button class="btn btn-brand-primary" @click="showRegister = true">
        Register
      </Button>
      <button btn @click="toggleDark()">
        <div v-if="isDark" i-carbon-moon />
        <div v-else i-carbon-sun />
      </button>
    </div>
  </nav>
  <LoginModal :show="showLogin" @close="showLogin = false" @submit="handleLogin" />
  <RegisterModal :show="showRegister" @close="showRegister = false" @submit="handleRegister" />
</template>

<style scoped lang="scss">
nav{
  @apply h-15 w-screen shadow dark:shadow-brand-primary shadow-lg flex items-center xl:px-50 lg:px-25 md:px-15 px-5;

  .nav-header{
    @apply font-bold text-2xl
  }
}
</style>

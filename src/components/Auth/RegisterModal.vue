<script setup lang="ts">
defineProps<{
  show: boolean
}>();

defineEmits<{
  (event: 'submit', form: any): void
}>();

const formState = reactive<{
  username: string
  email: string
  password: string
  password_confirmation: string
}>({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
});
</script>

<template>
  <Modal :show="show" is-form @submit="$emit('submit', formState)">
    <template #title>
      Register
    </template>
    <Input id="register--username" v-model="formState.username" label="Username" autocomplete="off" name="username" />
    <Input id="register--email" v-model="formState.email" label="Email" name="email" />
    <Input id="register--password" v-model="formState.password" type="password" label="Password" autocomplete="new-password" name="password" />
    <Input id="register--password_confirmation" v-model="formState.password_confirmation" type="password" autocomplete="off" label="Confirm Password" name="password_confirmation" />
    <template #footer>
      <Button class="btn btn-brand-primary" type="submit">
        Register
      </Button>
    </template>
  </Modal>
</template>

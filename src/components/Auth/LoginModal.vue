<script setup lang="ts">
defineProps<{
  show: boolean
}>();

defineEmits<{
  (event: 'submit', form: any): void
}>();

const formState = reactive<{
  username: string
  password: string
}>({
  username: '',
  password: '',
});

function resetForm() {
  formState.username = formState.password = ''
}

defineExpose({ resetForm });
</script>

<template>
  <Modal :show="show" is-form @submit="$emit('submit', formState)">
    <template #title>
      Login
    </template>
    <Input id="login--username" v-model="formState.username" label="Username" name="username" />
    <Input id="login--password" v-model="formState.password" type="password" label="Password" name="password" />
    <template #footer>
      <Button class="btn btn-brand-primary" type="submit">
        Login
      </Button>
    </template>
  </Modal>
</template>

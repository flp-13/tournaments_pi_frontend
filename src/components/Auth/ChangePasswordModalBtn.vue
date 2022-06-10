<script setup lang="ts">
const emit = defineEmits<{
  (event: 'submit', formState: any, cb?: () => void): void
}>();
const showModal = ref(false);

const formState = reactive({
  oldPassword: '',
  password: '',
  password_confirmation: '',
});

function handleSubmit() {
  emit('submit', formState, () => {
    showModal.value = false;
  });
}
</script>

<template>
  <Button class="btn btn-theme-danger block my-4" @click="showModal = true">
    Change Password
  </Button>
  <Modal :show="showModal" is-form @close="showModal = false" @submit="handleSubmit">
    <template #title>
      Change Password
    </template>
    <Input
      id="change-password__old-password" v-model="formState.oldPassword"
      type="password" name="oldPassword" label="Old Password"
    />
    <Input
      id="change-password__new-password" v-model="formState.password"
      type="password" name="newPassword" label="Password"
    />
    <Input
      id="change-password__confirm-password" v-model="formState.password_confirmation"
      type="password" name="confirmPassword" label="Confirm Password"
    />
    <template #footer>
      <Button class="btn btn-theme-danger" type="submit">
        Change Password
      </Button>
    </template>
  </Modal>
</template>

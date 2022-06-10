<script setup lang="ts">
import type { Tournament } from '~/types';

const props = defineProps<{
  tournament: Tournament | null
}>();

const emit = defineEmits<{
  (event: 'submit', formData: any, cb?: () => void): void
}>();
const submitting = ref(false);
const formData = reactive<Tournament>(props.tournament ?? {
  id: null,
  name: '',
  description: '',
});

function handleSubmit() {
  submitting.value = true;
  emit('submit', formData, () => {
    submitting.value = false;
  });
}

watch(() => props.tournament, () => {
  Object.assign(formData, props.tournament ?? {
    id: null,
    name: '',
    description: '',
  });
}, { deep: true });
</script>

<template>
  <Modal is-form @submit="handleSubmit">
    <template #title>
      {{ formData.id ? 'Edit' : 'Add' }} Tournament
    </template>
    <Input v-model="formData.name" label="Tournament Title" type="text" name="name" />
    <AutosizeTextarea v-model="formData.description" label="Tournament Description" rows="1" class="text-black" />
    <template #footer>
      <div class="flex">
        <Button class="ml-auto btn btn-brand-primary" type="submit" :loading="submitting">
          Submit Tournament
        </Button>
      </div>
    </template>
  </Modal>
</template>

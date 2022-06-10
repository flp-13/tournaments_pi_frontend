<script setup lang="ts">
import type { Bracket, Player } from '~/types';

const props = defineProps<{
  selected: Bracket | null
  addedPlayers: Player[]
  remainingPlayers: Player[]
}>();

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'fill', player: Player): void
  (event: 'switch', player: Player): void
}>();

const fillModalType = ref('switch-player');
const selectedFill = ref<number | null>(null);
const selectedSwitch = ref<number | null>(null);

function handleClose() {
  selectedFill.value = selectedSwitch.value = null;
  emit('close');
}

function handleSubmit() {
  if (selectedFill.value) {
    const player = props.remainingPlayers.find(x => x.id === selectedFill.value);
    if (player) {
      emit('fill', player);
      selectedFill.value = selectedSwitch.value = null;
    }
  }
  else if (selectedSwitch.value) {
    const player = props.addedPlayers.find(x => x.id === selectedSwitch.value);
    if (player) {
      emit('switch', player);
      selectedFill.value = selectedSwitch.value = null;
    }
  }
}

const addedPlayers = computed(() => {
  return props.addedPlayers.filter(x => x.id !== props.selected?.player?.id);
});

watch(() => fillModalType.value, () => {
  selectedFill.value = selectedSwitch.value = null;
});
</script>

<template>
  <Modal :show="!!selected" is-form @close="handleClose" @submit="handleSubmit">
    <template #title>
      {{ selected?.player ? 'Switch' : 'Fill' }} Bracket With &nbsp;<Select
        id="modal-type" v-model="fillModalType" name="modalType"
        :style="{ marginTop: 0, marginBottom: 0 }" :options="[
          { label: 'Switch Player', value: 'switch-player' },
          { label: 'Remaining Players', value: 'remaining-player' },
        ]"
      />
    </template>
    <div flex flex-col>
      <template v-if="fillModalType === 'switch-player'">
        <div
          v-for="player in addedPlayers" :key="player.id ?? 0" py-2 pl-3 flex gap-3
          :class="{ 'dark:bg-dark-300 bg-light-800': selectedSwitch === player.id }"
        >
          <input :id="`added-modal-${player.id}`" v-model="selectedSwitch" type="radio" name="addedPlayerModal" :value="player.id" />
          <label :for="`added-modal-${player.id}`">{{ player.name }}</label>
        </div>
      </template>
      <template v-else>
        <div
          v-for="player in remainingPlayers" :key="player.id ?? 0" py-2 pl-3 flex gap-3
          :class="{ 'dark:bg-dark-300 bg-light-800': selectedFill === player.id }"
        >
          <input :id="`remaining-modal-${player.id}`" v-model="selectedFill" type="radio" name="remainingPlayerModal" :value="player.id" />
          <label :for="`remaining-modal-${player.id}`">{{ player.name }}</label>
        </div>
      </template>
    </div>
    <template #footer>
      <Button class="btn btn-brand-primary" type="submit">
        Edit Bracket
      </Button>
    </template>
  </Modal>
</template>

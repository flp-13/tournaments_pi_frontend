<script setup lang="ts">
import { useUser } from './stores/useUser';

const user = useUser();
const checkedUser = ref(false);
const overlay = ref<HTMLElement>();
const hideOverlay = ref(false);

document.body.classList.add('no-scroll');
onMounted(() => {
  user.getUser(() => {
    document.body.classList.remove('no-scroll');
    checkedUser.value = true;
    overlay.value?.classList.add('hiding');
    setTimeout(() => {
      hideOverlay.value = true;
    }, 200);
  });
});
</script>

<template>
  <div font-sans text="gray-700 dark:gray-200">
    <div v-if="checkedUser">
      <Navbar />
      <main class="mt-24">
        <router-view />
      </main>
      <Footer></Footer>
    </div>
    <div v-if="!hideOverlay" ref="overlay" class="overlay">
      <div class="__loader"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
main{
  min-height: calc(100vh - 3.75rem - 4.25rem);
}

.overlay{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  display: grid;
  place-items: center;
  opacity: 1;
  background: rgba(65, 65, 65);
  transition: 200ms all linear;

  &.hiding{
    opacity: 0;
  }
}
</style>

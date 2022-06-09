<script setup lang="ts">
const props = withDefaults(defineProps<{
  show: boolean,
  isForm?: boolean
}>(), {
  show: false,
  isForm: false
});

const emit = defineEmits<{
  (event: 'close'): void,
  (event: 'submit'): void
}>();

const overlay = ref<HTMLElement | null>(null);
const modal = ref<HTMLElement | null>(null);

function closeModal(){
  if(overlay.value && modal.value){
    overlay.value.classList.add("closing");
    modal.value.classList.add("closing");
  }
  setTimeout(() => {
    emit('close');  
  }, 105);
}

function handleClickedOverlay(e: MouseEvent){
  const target = e.target as HTMLElement;

  if(target.classList.contains('overlay')){
    closeModal();
  }
}

watch(() => props.show, () => {
  if(props.show){
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});

watch(() => overlay.value, () => {
  setTimeout(() => {
    if(overlay.value && modal.value){
      overlay.value.classList.add('shown');
      modal.value.focus();
      modal.value.classList.add('shown');
    }
  }, 10);
}, {deep: true})

</script>
<template>
  <Teleport to="body">
    <div v-if="show">
      <div class="overlay" ref="overlay" @click="handleClickedOverlay">
        <div class="modal" ref="modal" tabindex="-1" role="dialog">
          <div role="document">
            <template v-if="!isForm">
              <div class="modal-title" v-if="$slots.title">
                <slot name="title"></slot>
              </div>
              <slot></slot>
              <div class="modal-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
              </div>
            </template>
            <form v-else @submit.prevent="$emit('submit')">
              <div class="modal-title" v-if="$slots.title">
                <slot name="title"></slot>
              </div>
              <slot></slot>
              <div class="modal-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped lang="scss">
.overlay{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(128, 128, 128, 0);
  display: grid;
  place-items: center;
  z-index: 100;
  transition: 100ms all linear;

  &.shown{
    background: rgba(65, 65, 65, 0.5);
  }

  &.closing{
    background: rgba(128, 128, 128, 0);
  }

  .modal{
    bottom: 100px;
    opacity: 0;
    transition: 100ms all ease-out;
    @apply shadow-lg dark:shadow-brand-primary bg-white dark:bg-#121212 w-140 min-h-20 rounded-md relative z-1000 px-5 py-3 relative;

    &.shown{
      bottom: 50px;
      opacity: 1;
    }

    &.closing{
      bottom: 100px;
    }

    .modal-title{
      @apply text-2xl py-2 px-1 font-semibold relative;

      &::after{
        content: ' ';
        height: 0.1rem;
        width: 100%;
        @apply absolute bottom-1 left-0 shadow bg-gray-500 dark:shadow-brand-primary dark:bg-brand-primary
      }
    }
    
    .modal-body{
      @apply mt-2
    }

    .modal-footer{
      @apply mt-3 pt-3 relative;

      &::after{
        content: ' ';
        height: 0.05rem;
        width: 100%;
        opacity: 0.5;
        @apply absolute top-0 left-0 bg-gray-500 dark:bg-brand-primary
      }
    }
  }
}
</style>
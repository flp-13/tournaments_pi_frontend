<script setup lang="ts">
/**
 * Credits to:
 * https://github.com/devstark-com/vue-textarea-autosize
 * https://github.com/devstark-com/vue-textarea-autosize/issues/35
 */
const props = withDefaults(defineProps<{
  modelValue: string | number
  autosize?: boolean
  minHeight?: number | null
  maxHeight?: number | null
  important?: boolean | string[]
  label?: string
  id?: string
  name?: string
}>(), {
  modelValue: '',
  autosize: true,
  minHeight: null,
  maxHeight: null,
  important: false,
  id: '',
  name: '',
});
const emit = defineEmits<{
  (event: 'update:modelValue', val: string | number | undefined | string[]): void
}>();
const state = reactive<{
  val: string | string[] | undefined | number
  maxHeightScroll: boolean
  height: string
  focused: boolean
}>({
  val: '',
  maxHeightScroll: false,
  height: 'auto',
  focused: false,
});

const textarea = ref<HTMLTextAreaElement>();

state.val = props.modelValue;

onMounted(() => {
  resize();
});

const isResizeImportant = computed(() => {
  const imp = props.important;
  return imp === true || (Array.isArray(imp) && imp.includes('resize'));
});

const isOverflowImportant = computed(() => {
  const imp = props.important
  return imp === true || (Array.isArray(imp) && imp.includes('overflow'));
});

const isHeightImportant = computed(() => {
  const imp = props.important
  return imp === true || (Array.isArray(imp) && imp.includes('height'));
});

function resize() {
  const important = isHeightImportant.value ? 'important' : '';
  state.height = `auto${important ? ' !important' : ''}`;
  nextTick(() => {
    let contentHeight = textarea.value!.scrollHeight + 1
    if (props.minHeight)
      contentHeight = contentHeight < props.minHeight ? props.minHeight : contentHeight;

    if (props.maxHeight) {
      if (contentHeight > props.maxHeight) {
        contentHeight = props.maxHeight;
        state.maxHeightScroll = true;
      }
      else {
        state.maxHeightScroll = false;
      }
    }
    const heightVal = `${contentHeight}px`;
    state.height = `${heightVal}${important ? ' !important' : ''}`;
  });
}

const computedStyles = computed(() => {
  if (!props.autosize)
    return {};
  return {
    resize: isResizeImportant.value ? 'none' : 'none !important',
    height: state.height,
    overflow: state.maxHeightScroll ? 'auto' : (!isOverflowImportant.value ? 'hidden' : 'hidden !important'),
  };
});

watch(() => props.modelValue, () => {
  state.val = props.modelValue;
});

watch(() => state.val, (val) => {
  nextTick(resize);
  emit('update:modelValue', val);
});

watch(() => props.minHeight, () => {
  nextTick(resize);
});

watch(() => props.maxHeight, () => {
  nextTick(resize);
});

watch(() => props.autosize, (val) => {
  if (val)
    resize();
});
</script>

<template>
  <div class="input-group-wrapper">
    <div
      class="input-group" :class="{
        'has-value': state.val, [state.focused ? 'focused' : 'blurred']: true,
      }"
    >
      <textarea
        ref="textarea"
        v-model="state.val"
        :style="computedStyles as any"
        rows="1"
        @focus="resize"
        @focusin="state.focused = true"
        @focusout="state.focused = false"
      ></textarea>
      <label v-if="label">{{ label }}</label>
    </div>
    <div class="invalid-feedback"></div>
  </div>
</template>

<style scoped lang="scss">
@import '../styles/themes';

@mixin label-open{
  top: 0px;
  transform: none;
  font-size: 0.85rem;
  transition: 100ms all linear;
}

@mixin label-close{
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  pointer-events: none;
  transition: 100ms all linear;
}

.input-group-wrapper{
  margin-top: 1rem;
  margin-bottom: 1rem;

  .input-group{
    position: relative;
    margin-bottom: 0.25rem;

    &.is-invalid label{
      color: $dangerColour;
    }

    &.is-invalid::before{
      background-color: $dangerColour;
    }

    label{
      position: absolute;
      @include label-close;
      @apply dark:text-white;
    }

    textarea{
      padding-top: 1.25rem;
      padding-bottom: 0.5rem;
      padding-left: 15px;
      width: 100%;
      outline: none;
      @apply dark:text-#afafaf dark:bg-#272727 bg-#f4f4f4;
    }

    &::before, &::after{
      content: ' ';
      position: absolute;
      bottom: 0px;
      height: 2px;
      display: block;
    }

    &::before{
      width: 100%;
      @apply dark:bg-#808080 bg-#afafaf;
      z-index: 1;
    }

    &::after{
      width: 0%;
      background-color: $primaryColour;
      z-index: 2;
    }

    &.blurred{
      &::after{
        width: 0%;
        transition: 200ms all linear;
      }

      label{
        @include label-close;
      }
    }

    &.focused{
      &::after{
        width: 100%;
        transition: 200ms all linear;
      }

      label{
        color:$primaryColour;
        @include label-open;
      }
    }

    &.has-value label{
      @include label-open;
    }
  }

  .invalid-feedback{
    display: none;
    font-size: 0.75rem;
    color: $dangerColour;
  }

  .input-group.is-invalid + .invalid-feedback{
    display: block;
  }
}

textarea{
  @apply w-full;
}
</style>

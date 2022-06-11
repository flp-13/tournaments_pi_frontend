<script setup lang="ts">
import type { StyleValue } from 'vue';

const props = defineProps<{
  modelValue: string | number | null
  label?: string
  name: string
  id: string
  invalidFeedback?: string
  placeholder?: string
  style?: StyleValue
  options: { value: string; label: string }[]
}>();

defineEmits<{
  (event: 'update:modelValue', value: string | number | null): void
}>();

const focused = ref(false);

const options = computed(() => {
  if (props.placeholder)
    return [{ value: null, label: props.placeholder }, ...props.options]

  return props.options;
});
</script>

<template>
  <div class="input-group-wrapper" :style="style">
    <div class="input-group" :class="{ [focused ? 'focused' : 'blurred']: true }">
      <select :id="id" :name="name" :value="modelValue" bg-transparent @focusin="focused = true" @focusout="focused = false" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
        <option v-for="option in options" :key="option.value ?? 'placeholder'" text-1rem :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
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
  @apply inline-block;

  .input-group{
    position: relative;
    margin-bottom: 0.25rem;

    select{
      height: 3.25rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      padding-left: 15px;
      padding-right: 15px;
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
}
</style>

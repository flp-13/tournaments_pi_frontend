<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: String,
  min: Number,
  max: Number,
  label: String,
  name: String,
  type: String,
  id: String,
  invalidFeedback: String,
  autocomplete: String,
  placeholder: String,
});

const value = ref(props.modelValue ?? '');
const focused = ref(false);

watch(() => props.modelValue, () => { value.value = props.modelValue });

function handleFocus(value) {
  focused.value = value;
}
</script>

<template>
  <div class="input-group-wrapper">
    <div class="input-group" :class="{ 'has-value': value.length > 0, [focused ? 'focused' : 'blurred']: true, 'is-invalid': invalidFeedback }">
      <input
        :id="id" v-model="value" :type="type" :name="name" :min="min" :max="max"
        :autocomplete="autocomplete"
        :placeholder="focused && value.length === 0 ? placeholder : ''"
        @input="$emit('update:modelValue', $event.target.value)"
        @focusin="handleFocus(true)"
        @focusout="handleFocus(false)"
      />
      <label v-if="label" class="flex gap-1 items-center mb-2" :for="id">
        <div><slot name="label-icon"></slot></div>
        <div>{{ label }}</div>
      </label>
    </div>
    <div class="invalid-feedback">
      {{ invalidFeedback }}
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
    }

    input{
      height: 3.25rem;
      padding-top: 0.75rem;
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
</style>

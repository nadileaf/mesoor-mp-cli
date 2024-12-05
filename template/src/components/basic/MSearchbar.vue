<script lang="ts">
export default { name: 'MSearchbar', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { ref } from 'vue';

type Props = {
  modelValue?: string;
  bgColor?: string;
  focus?: boolean;
  radius?: number;
};

type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
  (e: 'change', value: Props['modelValue']): void;
};

const props = withDefaults(defineProps<Props>(), {
  bgColor: '#f2f2f3'
});
const emits = defineEmits<Emits>();

const isSearchFocus = ref(props.focus);

function handleUpdateModel(val: string) {
  emits('update:modelValue', val);
}

function handleChange({ value }: { value: string }) {
  console.log('handleChange', value);
  emits('change', value);
}

function handleClear({ value }: { value: string }) {
  console.log('handleClear', value);
  emits('change', undefined);
}
</script>

<template>
  <uni-search-bar
    v-bind="{ ...$attrs, ...props }"
    class="m-searchbar"
    :class="{ 'is-focus': isSearchFocus }"
    cancelButton="false"
    :radius="props.radius ?? 10"
    @update:modelValue="handleUpdateModel"
    @focus="isSearchFocus = true"
    @blur="isSearchFocus = false"
    @confirm="handleChange"
    @clear="handleClear"
  />
</template>

<style lang="scss"></style>

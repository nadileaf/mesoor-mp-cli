<script lang="ts">
export default { name: 'MCheckTag' };
</script>

<script lang="ts" setup>
type Props = {
  checked?: boolean;
  cancelable?: boolean;
  rounded?: 'sm' | 'lg';
};

type Emits = {
  (e: 'change', checked: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  checked: false,
  cancelable: true,
  rounded: 'lg'
});

const emits = defineEmits<Emits>();

const checked = ref(props.checked);

watchEffect(() => {
  checked.value = props.checked;
});

function handleClickTag() {
  if (props.cancelable) {
    checked.value = !checked.value;
    emits('change', checked.value);
  } else if (!checked.value) {
    checked.value = true;
    emits('change', checked.value);
  }
}
</script>

<template>
  <view
    class="m-check-tag"
    :class="[checked ? 'tag--active' : 'tag--normal', rounded === 'lg' ? 'rounded-98px' : 'rounded']"
    @click="handleClickTag"
  >
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.m-check-tag {
  @apply px-20px py-8px border border-solid border-primary;
}

.tag--normal {
  @apply text-primary bg-white;
}

.tag--active {
  @apply text-white  bg-primary;
}
</style>

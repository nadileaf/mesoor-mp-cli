<script lang="ts" setup>
import type { IconTypes } from '@/assets/icons/index';

const props = defineProps<{
  gender: string;
}>();

const genderIcon = computed<IconTypes | undefined>(() =>
  props.gender ? (props.gender === '男' ? 'icon-male' : 'icon-female') : undefined
);
</script>

<template>
  <view
    class="rounded-full w-14px h-14px flex items-center justify-center"
    :class="[gender === '男' && 'bg-blue-400', gender === '女' && 'bg-pink-400']"
  >
    <MIcon :type="genderIcon" class="text-white font-extra-bold text-10px"></MIcon>
  </view>
</template>

<style lang="scss" scoped></style>

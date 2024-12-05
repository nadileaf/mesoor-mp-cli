<script lang="ts">
export default { name: 'Banner', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
type Props = {
  data: { name: string; url: string }[];
  height?: string;
};

const props = defineProps<Props>();

const current = ref(0);

function handleChange(e: any) {
  current.value = e.detail.current;
}
</script>

<template>
  <view class="banner-container">
    <swiper class="banner" :current="current" :duration="200" @change="handleChange">
      <swiper-item v-for="(item, index) in props.data" :key="index" class="flex-center">
        <MImage :src="item.url" mode="aspectFill" class="w-full h-full rounded-18px overflow-hidden" size="l16x9" noBg></MImage>
      </swiper-item>
    </swiper>
    <view class="banner-indicator">
      <view v-for="(item, index) in props.data" :key="index" class="banner-indicator-item" :class="{ active: index === current }"></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.banner-container {
  @apply relative;
}
.banner {
  @apply h-172px;
}
.banner-indicator {
  @apply relative flex items-center justify-center mt-10px;
  &-item {
    @apply w-8px h-8px rounded-6px mx-6px bg-gray-200 transition;
    &.active {
      @apply w-24px bg-primary;
    }
  }
}
</style>

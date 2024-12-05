<script lang="ts">
export default { name: 'Watermark', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();

const mark = computed(() => (authStore.sharer && !authStore.isNormalUser ? authStore.sharer : ''));
</script>

<template>
  <view class="fixed w-[200vw] h-[150vh] z-10 -top-[20vw] -left-[50vw] pointer-events-none opacity-30 transform -rotate-[20deg]">
    <view v-for="i in 30" :key="i" class="watermark-row whitespace-nowrap">
      <view v-for="j in 5" :key="j" class="inline-block p-40px">{{ mark }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.watermark-row:nth-child(2n + 1) {
  transform: translateX(10%);
}
</style>

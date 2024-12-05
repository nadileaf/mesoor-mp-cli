<script lang="ts">
export default {
  name: 'RecommendNotification',
  options: { virtualHost: true }
};
</script>

<script lang="ts" setup>
import MPopup from '@/components/basic/MPopup.vue';

const isShow = ref(false);

setTimeout(() => {
  const showed = uni.getStorageSync('recommendNotificationShowed');
  if (showed) return;
  isShow.value = true;
  uni.setStorageSync('recommendNotificationShowed', true);
}, 3000);

const popupRef = ref<InstanceType<typeof MPopup>>();
function handleOpenSourcing() {
  isShow.value = false;
  popupRef.value?.open();
}
</script>

<template>
  <view class="float-btn__default bottom-50px" @click.stop="handleOpenSourcing">复推助手</view>
  <view class="notification-container" :class="{ show: isShow }">
    <view class="p-4 flex flex-col gap-4">
      <view class="text-center text-base font-bold">告诉我们您的Sourcing要求</view>
      <view class="text-center text-gray-500">专职复推助手将为您提供1v1 Sourcing服务</view>
      <view class="flex items-center justify-center gap-6">
        <MButton type="primary" @click="handleOpenSourcing">立即联系</MButton>
        <text class="text-gray-400" @click="() => (isShow = false)">稍后</text>
      </view>
    </view>
  </view>
  <MPopup ref="popupRef" width="90vw" placement="center">
    <view class="p-4 flex flex-col gap-4">
      <view class="text-center text-base font-bold">CGL复推助手</view>
      <view class="text-center text-gray-500">微信长按识别或扫码添加</view>
      <view class="text-center text-gray-500">专职Sourcing助手将为您提供1v1 Sourcing服务</view>
      <view class="flex justify-center p-4">
        <image
          src="https://cdn-fe.mesoor.com/custom/cgl/assets/service_qrcode.jpeg"
          mode="widthFix"
          class="w-[90%]"
          show-menu-by-longpress
        />
      </view>
    </view>
  </MPopup>
</template>

<style lang="scss" scoped>
.notification-container {
  @apply fixed z-999 left-0 bottom-0 w-full bg-white transition-transform duration-300 transform translate-y-full;
  box-shadow: 0px 0 13px rgba(0, 0, 0, 0.3);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  visibility: hidden;
  &.show {
    @apply translate-y-0 visible;
  }
}
</style>

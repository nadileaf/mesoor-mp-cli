<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';

const router = useRouter<{
  title: string;
  subTitle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  cb: (text: string) => void;
}>();

const value = ref(router.routerData?.value ?? '');

const MAX_LENGTH = 999;

function handleConfirm() {
  router.routerData?.cb(value.value);
  router.navigateBack();
}
</script>

<template>
  <view class="h-100vh bg-white">
    <view class="flex flex-col gap-15px p-20px">
      <text class="font-medium text-20px text-dark-50">{{ router.routerData?.title }}</text>
      <text class="text-14px text-gray-500 font-light">{{ router.routerData?.subTitle }}</text>
      <textarea
        v-model="value"
        class="textarea"
        placeholder-style="color:#e1e1e3"
        :placeholder="router.routerData?.placeholder"
        :maxlength="MAX_LENGTH"
        :disabled="router.routerData?.disabled"
      />
      <view class="w-full flex items-center justify-end text-12px h-40px">
        <text class="text-primary font-light">{{ value.length }}</text>
        <text class="font-light text-gray-500">/{{ MAX_LENGTH }}</text>
      </view>
    </view>

    <view v-if="!router.routerData?.disabled" class="m-footer">
      <MButton class="submit" type="primary" size="middle" @click="handleConfirm">提交保存</MButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.textarea {
  @apply transition my-5px;
  height: 500px;
  border: none;
  width: 100%;
  line-height: 1.5;
}
</style>

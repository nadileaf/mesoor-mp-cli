<script lang="ts" setup>
import Banner from '@/components/business/other/banner.vue';
import { useRequest } from '@/hooks/useRequest';
import { bannerService } from '@/services/banner';

const { response: banners } = useRequest(() => bannerService.query({ projectName: '测评' }));
</script>

<template>
  <view class="container has-footer">
    <view>
      <view v-if="banners?.length">
        <Banner :data="banners" />
      </view>
      <view class="m-4">
        <slot></slot>
      </view>
    </view>
    <view class="m-footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>

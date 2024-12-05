<script lang="ts">
export default { name: 'MNavBar' };
</script>

<script lang="ts" setup>
import { HOME_PAGE } from '@/config';
import { useRouter } from '@/hooks/useRouter';
import { computed } from 'vue';
import type { IconTypes } from '@/assets/icons';

type Props = {
  titleClass?: string;
  backgroundColor?: string;
  fixed?: boolean;
  statusBar?: boolean;
  shadow?: boolean;
  border?: boolean;
  height?: string | number;
  dark?: boolean;
  leftWidth?: string | number;
  rightWidth?: string | number;
};
const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#ffffff',
  statusBar: true,
  border: false,
  height: 44
});

const router = useRouter();

const pages = getCurrentPages();

const isBack = computed(() => pages.length > 1);

function routeTo() {
  isBack.value ? router.navigateBack() : router.reLaunch(HOME_PAGE);
}
</script>

<template>
  <uni-nav-bar v-bind="{ ...props }">
    <template #left>
      <slot name="left">
        <view class="mui-navbar-icon" @click="routeTo">
          <MIcon :type="isBack ? 'icon-back' : 'icon-home'" class="text-18px"></MIcon>
        </view>
      </slot>
    </template>
    <template #right>
      <slot name="right"></slot>
    </template>
    <template #default>
      <view :class="props.titleClass">
        <slot></slot>
      </view>
    </template>
  </uni-nav-bar>
</template>

<style lang="scss" scoped>
.mui-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 9;
  align-items: center;
  height: 44px;
  padding: 20px 50px 0 10px;
  background-color: transparent;
  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 100%;
    width: 30px;
    height: 30px;
  }
  &-title {
    flex: 1;
  }
}
</style>

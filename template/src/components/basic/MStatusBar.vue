<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { useAppStore } from '@/stores';
import type { CSSProperties } from 'vue';

type Props = {
  /** 是否正常文档流定位 */
  static?: boolean;
  hasBack?: boolean;
  customBackCb?: () => void;
  title?: string;
  bgColor?: string;
  textColor?: string;
  bgBackdrop?: string;
  bgUrl?: string;
  placeholderHeight?: string;
  overflowVisible?: boolean;
  navStyle?: CSSProperties;
};

const props = withDefaults(defineProps<Props>(), {
  bgColor: 'transparent',
  textColor: '#0D0D26'
});
const appStore = useAppStore();

const statusBarHeight = uni.getSystemInfoSync().statusBarHeight ?? 0;
const heightVal = computed(() => statusBarHeight + appStore.miniAppNavHeight);
const placeholderHeight = computed(() => props.placeholderHeight || `${heightVal.value}px`);

const paddingLeft = `calc(100vw - ${appStore.menuButtonInfo.right}px)`;
// const paddingRight = `calc((100vw - ${appStore.menuButtonInfo.right}px) * 2 + ${appStore.menuButtonInfo.width}px)`;

const backdrop = computed(() => props.bgBackdrop || `none`);

const currentNavStyle = computed(() => {
  return {
    backgroundColor: props.bgColor,
    backgroundImage: props.bgUrl ? `url(${props.bgUrl})` : `none`
  };
});
</script>

<template>
  <view
    class="nav-area"
    :class="[overflowVisible ? 'overflow-visible' : 'overflow-hidden', static ? 'static' : 'fixed top-0 left-0']"
    :style="{ ...currentNavStyle }"
  >
    <MBack class="back-btn" v-if="props.hasBack" :color="props.textColor" :custom-back-cb="props.customBackCb" />
    <slot>
      <view v-if="title" class="mx-auto font-semibold text-14px max-w-[80vw] overflow-hidden whitespace-pre">{{ title }}</view>
    </slot>
  </view>

  <view class="status-bar-placeholder"></view>
</template>

<style lang="scss" scoped>
.status-bar-placeholder {
  height: v-bind('placeholderHeight');
  background-color: transparent;
}

.nav-area {
  @apply z-100 w-100vw bg-transparent flex items-center transition;
  transition-property: background-color, backdrop-filter;
  transition-duration: 0.5s;
  min-height: v-bind('heightVal + `px`');
  // paddingTop: 系统状态栏的高度
  padding-top: v-bind('statusBarHeight + `px`');
  // padding-left: v-bind('paddingLeft');
  // padding-right: v-bind('paddingRight');
  background-size: 100%;
  backdrop-filter: v-bind('backdrop');

  .back-btn {
    @apply absolute z-999;
    left: v-bind('paddingLeft');
  }
}
</style>

<script lang="ts">
export default { name: 'MButton', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import MIcon from '@/components/basic/MIcon.vue';
import type { IconTypes } from '@/assets/icons';

interface Props {
  /** 主题色 */
  type?: Common.ComponentType;
  /** 宽度撑满 */
  fullWidth?: boolean;
  /** 尺寸大小 */
  size?: 'default' | 'mini' | 'middle' | 'large';
  /** 纯文字 */
  text?: boolean;
  /** 次要背景 */
  secondary?: boolean;
  /** 镂空背景 */
  plain?: boolean;
  /** 图标 */
  icon?: IconTypes;
  /** 禁用 */
  disabled?: boolean;
  /** 加载中 */
  loading?: boolean;

  formType?: string;
  openType?: string;
  /** 是否需要阻止重复点击【默认200ms】 */
  preventClick?: boolean;
  color?: string;
}
interface Emits {
  (e: 'click', value: Event): void;
  (e: 'getUserInfo', value: any): void;
  (e: 'contact', value: any): void;
  (e: 'getPhoneNumber', value: any): void;
  (e: 'error', value: any): void;
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  preventClick: true
});
const emits = defineEmits<Emits>();

const iconSize = { large: 22, middle: 20, default: 18, mini: 14 };
const time = ref(0);

function handleClick(e: Event) {
  if (props.disabled || props.loading) return;
  if (props.preventClick) {
    if (new Date().getTime() - time.value <= 200) return;
    time.value = new Date().getTime();
    setTimeout(() => (time.value = 0), 200);
  }
  emits('click', e);
}
function handleGetUserInfo({ detail = {} } = {}) {
  emits('getUserInfo', detail);
}
function handleContact({ detail = {} } = {}) {
  emits('contact', detail);
}
function handleGetPhoneNumber({ detail = {} } = {}) {
  emits('getPhoneNumber', detail);
}
function handleError(data: any) {
  emits('error', data);
}
</script>

<template>
  <button
    class="mui-btn"
    :class="[
      'mui-btn-' + props.type,
      props.text && 'is-text',
      props.fullWidth && 'w-full',
      props.size,
      props.plain && 'is-plain',
      props.secondary && 'is-secondary disable-border',
      props.disabled && 'is-disabled'
    ]"
    :style="{ backgroundColor: props.color }"
    :disabled="props.disabled"
    :size="props.size"
    :plain="props.plain"
    :loading="props.loading"
    :form-type="props.formType"
    :open-type="props.openType"
    @getuserinfo="handleGetUserInfo"
    @getphonenumber="handleGetPhoneNumber"
    @contact="handleContact"
    @error="handleError"
    @tap="handleClick"
  >
    <MIcon v-if="props.icon" :type="props.icon" :size="iconSize[props.size]" class="mui-btn-icon"></MIcon>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@mixin btn-theme($bgColor, $color) {
  background-color: $bgColor;
  color: $color;
  @include btn-icon-theme($color);
  &.is-plain {
    background-color: #fff;
    color: $bgColor;
    @include btn-icon-theme($bgColor);
    &::after {
      border: 1px solid $bgColor;
    }
  }
  &.is-text {
    background-color: transparent;
    color: $bgColor;
    padding: 0;
    font-size: inherit;
    @include btn-icon-theme($bgColor);
    &::after {
      border-color: transparent !important;
    }
  }
  &.is-secondary {
    background-color: mix($bgColor, #fff, 10%);
    color: $bgColor;
  }
  &.is-disabled {
    @apply opacity-50;
  }
}
@mixin btn-icon-theme($color) {
  .mui-btn-icon {
    color: $color !important;
  }
}
.mui-btn {
  position: relative;
  border: 0 !important;
  border-radius: 6px;
  padding: 10px 16px;
  overflow: visible;
  display: inline-flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: $uni-text-color;
  font-size: 14px;
  line-height: 1;
  &.mini {
    font-size: 12px;
    padding: 6px 10px;
  }
  &.small {
    font-size: 12px;
    padding: 8px 12px;
  }
  &.middle {
    line-height: 20px;
    font-size: 16px;
    padding: 12px 18px;
  }
  &.large {
    font-size: 18px;
    padding: 14px 20px;
  }
  &-default {
    @include btn-theme(#fff, $uni-text-color);
    &.is-plain {
      color: $uni-text-color;
      @include btn-icon-theme($uni-text-color);
    }
  }
  &-primary {
    @include btn-theme($uni-color-primary, #fff);
  }
  &-error {
    @include btn-theme($uni-color-error, #fff);
  }
  &-warning {
    @include btn-theme($uni-color-warning, #fff);
  }
  &-success {
    @include btn-theme($uni-color-success, #fff);
  }
  &-info {
    @include btn-theme($uni-color-info, #fff);
  }
  &-icon {
    margin-right: 6px;
  }

  &.w-full {
    width: 100%;
  }
}
</style>

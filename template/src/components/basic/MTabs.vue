<script lang="ts">
export default { name: 'MTabs', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { BG_COLOR, THEME_COLOR } from '@/config';
import type { CSSProperties } from 'vue';

export type Tab<T extends string | number = string> = {
  value: T;
  label?: string;
};

type Props = {
  modelValue: Tab['value'];
  items: Tab[];
  type: 'default' | 'text';
  bgColor?: string;
  showBorderBottom?: boolean;
  justifyContent?: 'flex-start' | 'center' | 'space-between' | 'space-around';
  underlineWidth?: string;
  underlineHeight?: string;
  itemStyle?: CSSProperties;
  activeStyle?: CSSProperties;
};

type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
  (e: 'change', value: Props['modelValue'], item: Props['items'][number]): void;
};

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  showBorderBottom: true,
  underlineHeight: '5px'
});

const emits = defineEmits<Emits>();

const currentTab = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
});

const bgColor = computed(() => props.bgColor ?? BG_COLOR);
const underlineWidth = computed(() => props.underlineWidth ?? '100%');

function handleSelectTab(item: Props['items'][number]) {
  currentTab.value = item.value;
  emits('change', item.value, item);
}

const justifyContent = computed(() => {
  if (props.justifyContent) return props.justifyContent;

  const shouldCenter = props.type === 'default' && props.items.length < 3;
  if (props.type === 'text') return 'flex-start';
  return shouldCenter ? 'center' : 'space-between';
});
</script>

<template>
  <scroll-view scroll-x class="scroll-view-container" :class="{ 'h-40px': props.type === 'default' }">
    <view
      :class="[type === 'text' ? 'tab-bar_text' : `tab-bar ${showBorderBottom && 'border-bottom'} `]"
      :style="{
        justifyContent: justifyContent + ' !important'
      }"
    >
      <view
        v-for="tab in items"
        :key="tab.value"
        :class="['tab-item', currentTab === tab.value && `is-active`]"
        :style="currentTab === tab.value ? activeStyle : itemStyle"
        @click="handleSelectTab(tab)"
      >
        {{ tab.label ?? tab.value }}
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
.scroll-view-container {
  background: v-bind(bgColor);
}
.border-bottom {
  border-bottom: 1px solid #eceff4;
}
.tab-item {
  font-size: 14px;
  flex-shrink: 0;
  &.is-active {
    font-weight: 600;
  }
}

.tab-bar {
  @apply h-full flex justify-between items-center gap-3 box-border z-10;
  position: sticky;
  top: 0;
  min-width: 100%;
  width: max-content;

  .tab-item {
    @apply h-full flex justify-center items-center min-w-60px;
    font-weight: 500;

    &::after {
      @apply rounded-full;
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      content: '';
      opacity: 0;
      width: 0;
      height: v-bind(underlineHeight);
      background: v-bind(THEME_COLOR);
      transition: width 0.2s ease-in-out;
    }

    &.is-active {
      @apply relative;
      color: v-bind(THEME_COLOR);

      &::after {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 1;
        width: v-bind(underlineWidth);
      }
    }
  }
}

.tab-bar_text {
  @apply flex;

  .tab-item {
    @apply text-grey-60 py-4px px-10px;
    font-size: 14px;

    &.is-active {
      @apply text-gray-800;
    }
  }
}
</style>

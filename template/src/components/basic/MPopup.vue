<script lang="ts">
export default { name: 'MPopup', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { TAB_BAR_PAGES } from '@/config';
import { ref } from 'vue';

interface Props {
  /** 弹出位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** 点击遮罩关闭 */
  closeOnClickOverlay?: boolean;
  /** 圆角 */
  round?: boolean;
  /** 背景色 */
  backgroundColor?: string;
  width?: string;
  safeArea?: boolean;
}
interface Emits {
  (e: 'handleClose'): void;
}
const props = withDefaults(defineProps<Props>(), {
  placement: 'center',
  backgroundColor: '#fff',
  round: true,
  closeOnClickOverlay: true
});
const emits = defineEmits<Emits>();
defineExpose({ open, close });

const popupRef = ref();

const { currentPageUrl } = useRouter();

const containerWidth = computed(() => props.width ?? (props.placement === 'center' ? '80%' : '100%'));

function open() {
  toggleTabBar(true);
  popupRef.value.open();
}
function close() {
  toggleTabBar(false);
  popupRef.value.close();
  emits('handleClose');
}

function toggleTabBar(show: boolean) {
  try {
    props.placement === 'bottom' && TAB_BAR_PAGES.includes(currentPageUrl) && (show ? uni.hideTabBar() : uni.showTabBar());
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <uni-popup ref="popupRef" :type="props.placement" :safeArea="props.safeArea" :is-mask-click="closeOnClickOverlay">
    <view
      class="mui-popup-container"
      :class="[props.round && 'is-round', props.placement]"
      :style="{ backgroundColor: props.backgroundColor, width: containerWidth }"
    >
      <slot></slot>
    </view>
  </uni-popup>
</template>

<style lang="scss" scoped>
.mui-popup-container {
  min-height: 50px;
  padding-top: 10px;
  text-align: initial;
  margin: 0 auto;
  &.is-round {
    &.center {
      border-radius: 10px;
    }
    &.top {
      border-radius: 0 0 10px 10px;
    }
    &.right {
      border-radius: 10px 0 0 10px;
    }
    &.bottom {
      border-radius: 10px 10px 0 0;
    }
    &.left {
      border-radius: 0 10px 10px 0;
    }
  }
}
</style>

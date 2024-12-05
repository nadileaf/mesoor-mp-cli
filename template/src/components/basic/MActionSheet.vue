<script lang="ts">
export default { name: 'MActionSheet' };
</script>

<script lang="ts" setup>
import MPopup from '@/components/basic/MPopup.vue';

export type Action = {
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  callback?: () => void;
};

interface Props {
  /** 面板选项列表 */
  actions: Action[];
  /** 标题 */
  title?: string;
  /** 点击遮罩关闭 */
  closeOnClickOverlay?: boolean;
  /** 圆角 */
  round?: boolean;
  /** 取消文案，传空不显示取消 */
  cancelText?: string;
}
interface Emits {
  (e: 'select', action: Props['actions'][number], index: number): void;
  (e: 'cancel'): void;
}
const props = withDefaults(defineProps<Props>(), {
  closeOnClickOverlay: true,
  cancelText: '取消',
  round: true
});
const emits = defineEmits<Emits>();
defineExpose({ open });

const popupRef = ref<InstanceType<typeof MPopup>>();

function open() {
  popupRef.value?.open();
}
function close() {
  popupRef.value?.close();
}

function handleClickAction(action: Action, index: number) {
  if (action.disabled) return;
  action.callback?.();
  emits('select', action, index);
  close();
}
function cancel() {
  close();
  emits('cancel');
}
</script>

<template>
  <MPopup ref="popupRef" placement="bottom" :closeOnClickOverlay="props.closeOnClickOverlay" :round="props.round">
    <view class="mui-actionsheet">
      <view v-if="props.title" class="mui-actionsheet-title">
        {{ props.title }}
      </view>
      <view class="mui-actionsheet-items">
        <template v-for="(action, index) in props.actions" :key="index">
          <view
            class="mui-actionsheet-item mui-actionsheet-divider"
            :class="[action.disabled && 'mui-actionsheet-disabled']"
            hover-class="mui-actionsheet-item-hover"
            :hover-stay-time="150"
            @click="handleClickAction(action, index)"
          >
            <view :class="action.className">
              {{ action.label }}
            </view>
          </view>
        </template>
      </view>
      <view
        class="mui-actionsheet-item mui-actionsheet-cancel"
        hover-class="mui-actionsheet-item-hover"
        :hover-stay-time="150"
        v-if="props.cancelText"
        @click="cancel"
      >
        {{ props.cancelText }}
      </view>
    </view>
  </MPopup>
</template>

<style lang="scss" scoped>
.mui-actionsheet {
  margin-top: -10px;
  &-title {
    width: 100%;
    padding: 15px 30px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #ccc;
  }
  &-item {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 16px;
    position: relative;
    color: #333;
    &-hover {
      background-color: #f7f7f9;
    }
  }
  &-disabled {
    opacity: 0.4;
  }
  &-divider::before {
    content: '';
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  &-cancel {
    position: relative;
    flex-direction: column;
    margin-top: 10px;
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 0;
      right: 0;
      height: 10px;
      background-color: $uni-bg-color-grey;
    }
  }
}
</style>

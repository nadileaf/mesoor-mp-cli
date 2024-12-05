<script lang="ts">
export default { name: 'MTag', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
interface Props {
  size?: 'default' | 'mini';
  type?: Common.ComponentType;
  /** 镂空背景 */
  plain?: boolean;
  /** 圆角 */
  round?: boolean;
}
interface Emits {
  (e: 'click'): void;
}
const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  type: 'default'
});
const emits = defineEmits<Emits>();

function handleClick() {
  emits('click');
}
</script>

<template>
  <view
    class="mui-tag"
    :class="[props.plain && 'is-plain', props.round && 'is-round', 'mui-tag-' + props.type, props.size]"
    @click="handleClick"
  >
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
@mixin tag-theme($bgColor, $color) {
  background-color: $bgColor;
  color: $color;

  &.is-plain {
    background-color: transparent;
    color: $color;
    border: 1px solid $color;
  }
}
.mui-tag {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  padding: 7px 12px;
  font-size: 13px;
  line-height: 1;
  border-radius: 6px;
  &.mini {
    font-size: 10px;
    padding: 4px 8px;
  }
  &-default {
    @include tag-theme(#f5f5f5, #505050);
    &.is-plain {
      color: #505050;
    }
  }
  &-primary {
    @include tag-theme(mix($uni-color-primary, #fff, 10%), $uni-color-primary);
  }
  &-error {
    @include tag-theme(mix($uni-color-error, #fff, 10%), $uni-color-error);
  }
  &-warning {
    @include tag-theme(mix($uni-color-warning, #fff, 10%), $uni-color-warning);
  }
  &-success {
    @include tag-theme(mix($uni-color-success, #fff, 10%), $uni-color-success);
  }
  &-info {
    @include tag-theme(mix($uni-grey-60, #fff, 10%), $uni-grey-60);
  }
  &.is-round {
    border-radius: 50px;
  }
}
</style>

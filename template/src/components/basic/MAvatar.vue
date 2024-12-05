<script lang="ts">
export default { name: 'MAvatar', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { formatImageUrl } from '@/utils/format';
import { withCdnPrefix } from '@/utils/file';
import { DEFAULT_AVATAR_PATH } from '@/config';
import MImage from './MImage.vue';

interface Props {
  src?: string;
  size?: number;
  shape?: 'circle' | 'square';
  text?: string;
  imageSize?: Common.ImageSize;
  /** 缩放/裁剪方式 */
  mode?:
    | 'aspectFit'
    | 'scaleToFill'
    | 'aspectFill'
    | 'widthFix'
    | 'heightFix'
    | 'top'
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right';
  /** 是否随机默认头像 */
  random?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 30,
  shape: 'circle',
  imageSize: 's1x1'
});

const textSize = computed(() => {
  return 10 + Math.floor(props.size / 16);
});

const defaultAvatars = Array.from({ length: 14 }, (v, i) => withCdnPrefix(`/custom/cgl/assets/default-avatar/${i + 1}.png`));

const defaultAvatarSrc = computed(() => {
  if (props.random) {
    const random = Math.floor(Math.random() * defaultAvatars.length);
    return defaultAvatars[random];
  }
  return DEFAULT_AVATAR_PATH;
});

const src = computed(
  () =>
    formatImageUrl(props.src, { forceCDN: true, size: props.imageSize }) ||
    (props.random || !props.text ? defaultAvatarSrc.value : undefined)
);

function px2rpx(px: number) {
  return px * 2 + 'rpx';
}
</script>

<template>
  <view :class="['mui-avatar', props.shape]" :style="{ width: px2rpx(props.size), height: px2rpx(props.size) }">
    <MImage
      v-if="src"
      :src="src"
      :default-src="defaultAvatarSrc"
      :style="{ width: px2rpx(props.size), height: px2rpx(props.size) }"
      :size="imageSize"
      :mode="props.mode"
    ></MImage>
    <view v-else-if="props.text" :class="['mui-avatar-text', props.shape]" :style="{ fontSize: px2rpx(textSize) }">
      {{ props.text.substring(props.text.length - 2, props.text.length) }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mui-avatar {
  display: block;
  position: relative;
  color: #aaa;
  border-radius: 6px;
  overflow: hidden;
  // 防止被挤压
  flex-shrink: 0;

  // &::before {
  //   content: '';
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   left: 0;
  //   top: 0;
  //   background-color: #f5f5f5;
  // }
  &.circle {
    border-radius: 50%;
  }
  &-text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    background: #c0c4cc;
    color: white;
  }
}
</style>

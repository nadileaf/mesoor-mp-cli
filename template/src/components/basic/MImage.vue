<script lang="ts">
export default { name: 'MImage', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { formatImageUrl, formatVideoCover } from '@/utils/format';
import { getFileType, getFileIcon, previewFiles } from '@/utils/file';

interface Props {
  src?: string;
  defaultSrc?: string;
  rounded?: boolean;
  current?: number;
  size?: Common.ImageSize;
  //当设置urls时，开启preview功能
  urls?: Common.NormalizedField.File[];
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
  width?: string;
  height?: string;
  file?: Common.NormalizedField.File;
  showMenuByLongpress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'aspectFill'
});

const loading = ref(true);
const imageSrc = ref<string>();

const fileType = computed(() => (props.src && getFileType(props.src)) || (props.file && getFileType(props.file.fileName)) || 'image');

watchEffect(() => {
  props.src && initImageSrc(props.src);
});

function initImageSrc(src: string) {
  switch (fileType.value) {
    case 'image':
      imageSrc.value = formatImageUrl(src, {
        forceCDN: true,
        size: props.size
      });
      break;
    case 'video':
      imageSrc.value = formatVideoCover(src, {
        forceCDN: true,
        size: props.size
      });
      break;
    default:
      imageSrc.value = '';
  }
}

function handlePreview() {
  if (props.urls?.length) {
    const { current, urls } = props;
    previewFiles(urls, current);
  }
}

function handleError(e: Event) {
  console.log('error', e);
  imageSrc.value = props.defaultSrc || undefined;
  loading.value = false;
}

function onLoad(e: Event) {
  loading.value = false;
}
</script>

<template>
  <image
    :src="imageSrc"
    :mode="props.mode"
    class="mui-image"
    :class="[props.rounded && 'mui-image-rounded', loading && 'bg-transparent']"
    :style="{ width: props.width, height: props.height }"
    :show-menu-by-longpress="props.showMenuByLongpress"
    @load="onLoad"
    @error="handleError"
  >
    <view v-if="fileType !== 'image'" class="file-cover" :class="{ 'is-video': fileType === 'video' }">
      <uni-icons v-if="fileType === 'video'" type="videocam" class="m-icon text-white text-26px" />
      <template v-else>
        <image class="h-36px w-36px" :src="getFileIcon(props.src ?? '')" />
        <view class="mt-10px max-w-full text-10px truncate px-10px">{{ props.file?.fileName ?? '' }}</view>
      </template>
    </view>
    <view v-if="urls?.length" @click.stop="handlePreview" class="file-cover !bg-transparent"></view>
  </image>
</template>

<style lang="scss" scoped>
.mui-image {
  @apply relative block flex justify-center;

  &-rounded {
    border-radius: 6px;
    overflow: hidden;
  }
}
.file-cover {
  @apply absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center;
  background-color: $uni-bg-color-grey;

  &.is-video {
    @apply bg-[#00000077];
  }
}
</style>

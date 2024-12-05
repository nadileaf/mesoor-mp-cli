<script lang="ts">
export default { name: 'Files', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { pullAt } from 'lodash-es';
import { loadingModal } from '@/utils/common';
import MImage from '@/components/basic/MImage.vue';
import { uploadFiles, type FileType } from '@/utils/file';

type Props = {
  files?: Common.NormalizedField.File[];
  fileTypes?: FileType[];
  // default to 9
  limit?: number;
  column?: number;
  maxDisplayCount?: number;
  readonly?: boolean;
};

type Emits = {
  (e: 'update:files', value: Props['files']): void;
};

const props = withDefaults(defineProps<Props>(), {
  column: 3,
  limit: 9,
  fileTypes: () => ['image', 'video', 'doc', 'audio']
});

const emits = defineEmits<Emits>();

const showFiles = computed(() => props.files?.slice(0, props.maxDisplayCount ?? props.files?.length));
const remainCount = computed(() =>
  props.files?.length && props.maxDisplayCount && props.files.length > props.maxDisplayCount
    ? props.files.length - props.maxDisplayCount
    : 0
);

const uploadLimit = computed(() => props.limit - (props.files?.length ?? 0));

async function handleUpload() {
  if (props.readonly) return;
  uploadFiles({
    limit: uploadLimit.value,
    fileTypes: props.fileTypes,
    onProgress(e, res, index) {
      loadingModal.show({ title: '上传中' });
    },
    onSuccess(res) {
      loadingModal.hide();
      emits('update:files', props.files ? [...props.files, res] : [res]);
    },
    onError(err) {
      loadingModal.hide();
      console.log(err);
    }
  });
}

function handleDeleteFile(index: number) {
  if (props.readonly) return;
  if (props.files?.length) {
    const files = [...props.files];
    pullAt(files, index);
    emits('update:files', files);
  }
}
</script>

<template>
  <view v-if="showFiles?.length" class="file-grids" :class="`cols-${props.column}`">
    <view v-for="(file, index) in showFiles" :key="file.key" class="grid-item">
      <MImage
        class="grid-size absolute inset-0"
        :src="file.key"
        size="m1x1"
        :file="file"
        :current="index"
        :urls="props.files"
        rounded
        width="100%"
        height="100%"
      />
      <view v-if="remainCount && showFiles?.length && index === showFiles.length - 1" class="remain-count">+ {{ remainCount }}</view>

      <!-- 删除按钮 -->
      <uni-icons v-if="!props.readonly" type="closeempty" class="delete-button m-icon" @click.stop="handleDeleteFile(index)" />
    </view>

    <view v-if="!props.readonly && uploadLimit" class="grid-item add-file-button" @click="handleUpload">
      <uni-icons type="plusempty" class="m-icon text-[#e3e8f2] text-40px" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.file-grids {
  @apply grid grid-cols-3 gap-15px w-full;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  &.cols-2 {
    @apply grid-cols-2;
  }
  &.cols-3 {
    @apply grid-cols-3;
  }
  &.cols-4 {
    @apply grid-cols-4;
  }

  .grid-item {
    @apply flex justify-center items-center w-full box-border relative;
    aspect-ratio: 1;
  }
  .remain-count {
    @apply text-12px text-white rounded-sm bg-[#00000077] px-5px py-2px absolute bottom-0 right-0;
  }
  .add-file-button {
    @apply flex justify-center items-center rounded-6px;
    border: 1px dashed #e3e8f2;
  }

  .delete-button {
    @apply w-20px h-20px rounded-full bg-[#00000077] flex items-center justify-center absolute -top-5px -right-5px  text-white text-16px;
  }
}
</style>

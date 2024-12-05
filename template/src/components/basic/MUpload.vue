<script lang="ts">
export default { name: 'MUpload' };
</script>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue';
import { fileTypes, type FileType } from '@/utils/file';
import { formatFileUrl } from '@/utils/format';

type Props = {
  modelValue?: Common.NormalizedField.File[] | Common.NormalizedField.File;
  /** 可选择的文件类型 */
  fileType?: FileType;
  /** 可选择的文件后缀名,没有fileType时生效  */
  fileExtName?: string;
  limit?: number;
  /** 选择完文件上传 */
  handleUpload: (tempFiles: TempFiles) => Promise<void>;
  // handleUpload: (tempFilePaths: string[]) => Promise<Props['modelValue']>;
  /** 选择文件后的文件列表样式 */
  mode?: 'grid' | 'list';
  /** 组件禁用 */
  disabled?: boolean;
  /** 组件只读，不可选择，不显示进度，不显示删除按钮 */
  readonly?: boolean;
  /** 禁用图片预览，仅 mode:grid生效 */
  disablePreview?: boolean;
  /** 是否显示删除按钮 */
  delIcon?: boolean;
  /** 组件标题，右侧显示上传计数 */
  title?: string;
  /** original 原图，compressed 压缩图，默认二者都有 */
  sizeType?: ('original' | 'compressed')[];
  /** album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项 */
  sourceType?: ('album' | 'camera')[];
  /** mode:list 时的样式 */
  listStyles?: Partial<{
    borderStyle: Record<'color' | 'width' | 'style' | 'radius', string>;
    border: boolean;
    dividline: boolean;
  }>;
  /** mode:grid 时的样式 */
  imageStyles?: Partial<{
    borderStyle: Record<'color' | 'width' | 'style' | 'radius', string>;
    width: number;
    height: number;
  }>;
};

type TempFiles = {
  path: string;
  size: number;
  name: string;
  extname: string;
}[];
type TempFilePaths = string[];

type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
  (e: 'select', value: { tempFiles: TempFiles; tempFilePaths: TempFilePaths }): void;
};
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const uploadRef = ref();
const returnType = computed(() => {
  if (!props.modelValue || Array.isArray(props.modelValue)) {
    return 'array';
  } else return 'object';
});

const fileMediaType = computed(() => {
  if (props.fileType && ['image', 'video'].includes(props.fileType)) {
    return props.fileType;
  }
  return 'all';
});
const fileExtName = computed(() => {
  if (props.fileType) {
    return fileTypes[props.fileType].join(',');
  }
  return props.fileExtName;
});

const innerModelValue = computed({
  get() {
    if (Array.isArray(props.modelValue)) {
      const modelVal = props.modelValue;
      const value = modelVal?.map((item) => {
        const fileName = item.fileName || item.key.split('?')?.[0]?.split('/').pop();
        return {
          name: fileName,
          extname: fileName?.split('.').pop(),
          url: formatFileUrl(item.key, { forceCDN: true })
        };
      });
      return value;
    } else {
      const modelVal = props.modelValue;
      return modelVal
        ? {
            name: modelVal?.fileName,
            extname: modelVal?.fileName?.split('.').pop(),
            url: formatFileUrl(modelVal?.key, { forceCDN: true })
          }
        : undefined;
    }
  },
  set(val) {
    emits('update:modelValue', transformFile(val));
  }
});

function transformFile(val: UnwrapRef<typeof innerModelValue>) {
  if (Array.isArray(val)) {
    return val.map((item) => ({ key: item.url, fileName: item.name ?? '' }));
  } else if (val) {
    return { key: val.url ?? '', fileName: val.name ?? '' };
  }
}

async function handleSelectFile(val: { tempFiles: TempFiles; tempFilePaths: TempFilePaths }) {
  if (props.handleUpload) {
    console.log('handleSelectFile', val);
    await props.handleUpload(val.tempFiles);
    // const res = await props.handleUpload(val.tempFilePaths);
    // emits('update:modelValue', res);
  }
}

function clearFiles(index?: number) {
  uploadRef.value?.clearFiles(index);
}

defineExpose({ clearFiles });
</script>

<template>
  <uni-file-picker
    ref="uploadRef"
    v-model="innerModelValue"
    :return-type="returnType"
    :file-mediatype="fileMediaType"
    :limit="props.limit || 1"
    :fileExtname="fileExtName"
    :auto-upload="false"
    :mode="props.mode"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :disable-preview="props.disablePreview"
    :del-icon="props.delIcon"
    :title="props.title"
    :size-type="props.sizeType"
    :source-type="props.sourceType"
    :list-styles="props.listStyles"
    :image-styles="props.imageStyles"
    @select="handleSelectFile"
  >
    <slot></slot>
  </uni-file-picker>
</template>

<style lang="scss" scoped></style>

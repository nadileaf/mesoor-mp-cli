<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { getFileIcon, previewFiles } from '@/utils/file';

const { routerData } = useRouter<{ files: Common.NormalizedField.File[] }>();

const files = computed(() => routerData?.files ?? []);
</script>

<template>
  <view class="section pt-3">
    <view class="flex flex-col gap-3">
      <template v-for="(item, index) in files" :key="index">
        <view class="card" @click="previewFiles([item])">
          <image class="h-40px w-40px flex-shrink-0" mode="heightFix" :src="getFileIcon(item.fileName)" />
          <view class="flex-1 flex-grow min-w-1">
            <view class="truncate mb-5px">{{ item.fileName }}</view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.section {
  @apply mb-30px px-4;
}
.card {
  @apply flex justify-between justify-start gap-3 p-15px rounded-lg bg-white h-70px box-border;
  border: 1px solid #e5e7eb;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.03);
}
</style>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { getLocationData, type LocationOptions } from '@/services/dictionary';
import { isNumber, pull } from 'lodash-es';

import { useRequest } from '@/hooks/useRequest';
import { message } from '@/utils/common';

const router = useRouter<{
  isMultiple: boolean;
  selectedMaxCount: number;
  selectedItems?: string[];
  cb: (val: string[] | string) => void;
}>();

const provinces = ref<LocationOptions>([]);
const currentProvince = ref<LocationOptions[number]>();
const selectedItems = ref<string[]>([]);
const isMultiple = computed(() => !!router.routerData?.isMultiple);

watchEffect(() => {
  if (router.routerData?.selectedItems?.length) {
    selectedItems.value = router.routerData?.selectedItems;
  }
});

useRequest(() => getLocationData(), {
  showLoading: true,
  onSuccess: (res) => {
    provinces.value = res;
    currentProvince.value = res[0];
  }
});

function handleSelectCity(value?: string) {
  if (!value) return;
  if (isMultiple.value) {
    if (selectedItems.value.includes(value)) {
      pull(selectedItems.value, value);
    } else {
      const max = router.routerData?.selectedMaxCount;
      if (isNumber(max)) {
        selectedItems.value.length >= max ? message.info('最多只能选择' + max + '个城市') : selectedItems.value.push(value);
      } else {
        selectedItems.value.push(value);
      }
    }
  } else {
    router.routerData?.cb(value);
    router.navigateBack();
  }
}

function handleConfirm() {
  router.routerData?.cb(selectedItems.value);
  router.navigateBack();
}

const search = ref('');
const filteredItems = computed<LocationOptions>(() => {
  const items = provinces.value
    .map((pro) => pro.children)
    .flat()
    .filter((city) => city.label.includes(search.value));
  return items ?? [];
});

const listWrapHeight = computed(() => {
  return isMultiple.value ? `calc(100vh - 346rpx - max(var(--safe-area-inset-bottom), 15px))` : `calc(100vh - 180rpx)`;
});
</script>

<template>
  <view class="h-100vh">
    <view>
      <view class="search p-10px">
        <MSearchbar placeholder="搜索城市" focus v-model="search" />
      </view>
      <!-- 先移除定位 -->
      <!-- <view class="flex justify-between items-center h-34px box-border p-10px pt-0">
        <view class="flex items-center">
          <text class="text-gray-400 text-12px mr-2">当前定位城市</text>
          <view class="inline-flex items-center px-6px py-2px rounded-md bg-light-500 color-primary" @click="handleSelectCity(currentCity)">
            <uni-icons type="location" size="17" :color="THEME_COLOR" />
            {{ currentCity }}
          </view>
        </view>

        <view @click="initLocation" class="color-primary inline-flex items-center">
          <text class="mr-1">重新定位</text>
          <uni-icons type="refreshempty" size="14" :color="THEME_COLOR" />
        </view>
      </view> -->
      <view class="selected-bar" v-if="isMultiple">
        <text class="text-gray-400 text-12px">已选城市</text>
        <template v-for="(item, index) in selectedItems" :key="item">
          <view v-if="index < 3" class="inline-flex px-6px py-2px rounded-md bg-light-500" @click="handleSelectCity(item)">
            {{ item }}
          </view>
        </template>

        <view class="inline-flex items-center" v-if="selectedItems.length > 3">+{{ selectedItems.length - 3 }}</view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="list-wrap" v-if="search">
      <scroll-view class="list-inner" scroll-y>
        <view v-for="city in filteredItems" class="list-inner-item" :key="city.value" @click="handleSelectCity(city.ext_name)">
          {{ city.ext_name }}
        </view>
      </scroll-view>
    </view>

    <view class="list-wrap">
      <scroll-view class="list-inner list-inner-left" scroll-y>
        <view
          class="list-inner-item list-inner-item-left"
          :class="province.label === currentProvince?.label && `is-selected`"
          v-for="province in provinces"
          :key="province.value"
          @click="currentProvince = province"
        >
          {{ province.label }}
        </view>
      </scroll-view>

      <scroll-view class="list-inner" scroll-y>
        <view
          class="list-inner-item"
          v-for="city in currentProvince?.children"
          :key="city.value"
          @click="handleSelectCity(city.ext_name)"
          :class="selectedItems.includes(city.ext_name) && `is-selected`"
        >
          {{ city.ext_name }}
        </view>
      </scroll-view>
    </view>

    <view class="m-footer" v-if="isMultiple">
      <MButton class="save" type="default" size="middle" @click="router.navigateBack()">取消</MButton>
      <MButton class="submit" type="primary" size="middle" @click="handleConfirm">提交保存</MButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './style.scss';
:deep(.uni-searchbar__box) {
  background-color: #f5f5fa !important;
}

.list-wrap {
  border-top: $border-style;
  display: flex;
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  height: v-bind('listWrapHeight');
}
</style>

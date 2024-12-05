<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { useRequest } from '@/hooks/useRequest';
import { entityService } from '@/services/entity';
import { pull, last } from 'lodash-es';
import { message } from '@/utils/common';
import { formatPathValue } from '@/utils/format';
import { DictionaryTitleMap } from '@/models/entity';
import type { Arrayable } from '@/types/util';

const props = defineProps<{
  /** 不传 label 会尝试根据 id 获取对应字典 title  */
  label?: string;
  id?: DictionaryModel.DictionaryId;
}>();

const router = useRouter<{
  isMultiple: boolean;
  selectedItems: string[];
  selectedMaxCount?: number;
  /** 可以接受数据，如果传了 id，就会默认获取字典 */
  items?: DictionaryModel.DictionaryData;
  cb: (val: Arrayable<string>) => void;
}>();

const title = computed(() => props.label || (props.id ? DictionaryTitleMap.get(props.id) : ''));

uni.setNavigationBarTitle({ title: '选择' + title.value });

const simpleData = ref<string[]>([]);
const treesData = ref<DictionaryModel.Tree[]>([]);
const currentRoot = ref<DictionaryModel.Tree>();

const isSimpleData = (data: DictionaryModel.DictionaryData): data is string[] => typeof data[0] === 'string';

watchEffect(() => {
  const items = router.routerData?.items;
  if (!items?.length) return;

  if (isSimpleData(items)) {
    simpleData.value = items;
  } else {
    treesData.value = items;
    currentRoot.value = treesData.value[0];
  }
});

useRequest(() => entityService.queryDictionary(props.id as DictionaryModel.DictionaryId), {
  required: () => props.id,
  refreshDeps: [() => props.id],
  showLoading: true,
  enablePullDownRefresh: true,
  onSuccess(res) {
    simpleData.value = res.data.standardFields.data.stringArray || [];
    treesData.value = res.data.standardFields.data.trees || [];
    currentRoot.value = treesData.value[0];
  }
});

const selectedItems = ref<string[]>([]);
watchEffect(() => {
  selectedItems.value = router.routerData?.selectedItems ?? [];
});

const searchVal = ref('');
const filteredItems = computed(() => {
  if (simpleData.value.length) return simpleData.value.filter((item) => item.includes(searchVal.value));
  return flattenItems(treesData.value).filter((item) => item.join().includes(searchVal.value));
});

const isMultiple = computed(() => !!router.routerData?.isMultiple);
const topHeight = computed(() => (isMultiple.value ? `180rpx` : `110rpx`));

const listWrapHeight = computed(() => {
  return isMultiple.value
    ? `calc(100vh - ${topHeight.value} - 30rpx - max(var(--safe-area-inset-bottom), 15px) - 88rpx)`
    : `calc(100vh - ${topHeight.value})`;
});

const selectedBarTitleWidth = 50;
const selectedItemsWrapperWidth = computed(() => {
  const { windowWidth } = uni.getWindowInfo();
  return windowWidth - 20 - selectedBarTitleWidth;
});

function handleSelect(value: string | undefined) {
  if (!value) return;

  if (isMultiple.value) {
    // 包含则去除
    if (selectedItems.value.includes(value)) {
      pull(selectedItems.value, value);
      return;
    }
    // 反之则追加
    const max = router.routerData?.selectedMaxCount;
    if (max && selectedItems.value.length === max) {
      return message.info('最多只能选择' + max + '个职位');
    }
    selectedItems.value.push(value);
  } else {
    router.routerData?.cb(value);
    router.navigateBack();
  }
}

function flattenItems(items: DictionaryModel.Tree[]) {
  const result: string[][] = [];

  function flattenHelper(item: DictionaryModel.Tree[] | undefined, level: number, path: string[]) {
    if (!item || !item.length) {
      result.push(path);
      return;
    }
    for (const currentItem of item) {
      const newPath = [...path, currentItem.value];
      flattenHelper(currentItem.children, level + 1, newPath);
    }
  }

  flattenHelper(items, 0, []);
  return result;
}

function handleConfirmValues() {
  router.routerData?.cb(selectedItems.value);
  router.navigateBack();
}
</script>

<template>
  <view class="h-100vh">
    <view class="top-area">
      <view class="search p-10px">
        <MSearchbar :placeholder="`搜索${title}`" focus v-model="searchVal" />
      </view>
      <view v-if="isMultiple" class="selected-bar">
        <view class="selected-bar-title">已选{{ title }}</view>
        <scroll-view scroll-x class="selected-items-scroll">
          <view class="flex gap-4px">
            <MTag v-for="item in selectedItems" :key="item" type="primary" @click="handleSelect(item)">{{ formatPathValue(item) }}</MTag>
          </view>
        </scroll-view>
        <!-- <view v-if="selectedItems.length > 3" class="inline-flex items-center">+{{ selectedItems.length - 3 }}</view> -->
      </view>
    </view>
    <!-- 搜索结果 -->
    <view v-if="searchVal" class="list-wrap">
      <scroll-view class="list-inner pt-10px" scroll-y>
        <view
          v-for="(item, index) in filteredItems"
          :key="index"
          class="search-result"
          @click="handleSelect(typeof item === 'string' ? item : last(item))"
        >
          <template v-if="typeof item === 'string'">
            <view>{{ item }}</view>
          </template>
          <template v-else>
            <view :class="[item[2] ? 'text-gray-500 font-thin' : '']">{{ item[0] }} / {{ item[1] }}</view>
            <view v-if="item[2]">{{ item[2] }}</view>
          </template>
        </view>
      </scroll-view>
    </view>
    <!-- simple data list -->
    <view v-else-if="simpleData.length" class="list-wrap flex-col">
      <view
        v-for="item in simpleData"
        :key="item"
        class="list-inner-item"
        :class="[selectedItems.includes(item) && `is-selected bg-light-500`]"
        @click="handleSelect(item)"
      >
        {{ item }}
      </view>
    </view>
    <!-- tree data list -->
    <view v-else class="list-wrap">
      <scroll-view class="list-inner list-inner-left" scroll-y>
        <view
          v-for="tree in treesData"
          class="list-inner-item list-inner-item-left"
          :class="tree.value === currentRoot?.value && `is-selected`"
          :key="tree.value"
          @click="currentRoot = tree"
        >
          {{ tree.label }}
        </view>
      </scroll-view>
      <scroll-view class="list-inner" scroll-y>
        <view v-for="{ label, value, children } in currentRoot?.children" :key="value" class="sub-container">
          <view
            class="list-inner-item"
            :class="[selectedItems.includes(value) && `is-selected`, children.length && 'font-bold text-[#333]']"
            @click="!children.length && handleSelect(value)"
          >
            {{ label }}
          </view>
          <view class="card-container">
            <view
              v-for="child in children"
              :key="child.value"
              class="card"
              :class="selectedItems.includes(child.value) && `is-selected`"
              @click="handleSelect(child.value)"
            >
              {{ child.label }}
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view v-if="isMultiple" class="m-footer">
      <MButton class="save" type="default" size="middle" @click="router.navigateBack()">取消</MButton>
      <MButton class="submit" type="primary" size="middle" @click="handleConfirmValues">提交保存</MButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './style.scss';
:deep(.uni-searchbar__box) {
  background-color: #f5f5fa !important;
}

.search-result {
  @apply flex flex-col gap-1 px-20px py-8px;
  border-bottom: $border-style;
}
.top-area {
  height: v-bind('topHeight');
}

.selected-bar-title {
  @apply text-12px flex-shrink-0
  width:v-bind('selectedBarTitleWidth + "px"');
  color: #333;
}
.selected-items-scroll {
  width: v-bind('selectedItemsWrapperWidth + "px"');
  white-space: nowrap;
}

.list-wrap {
  border-top: $border-style;
  display: flex;
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  height: v-bind('listWrapHeight');
}

.card-container {
  @apply flex flex-wrap pl-20px;
  .card {
    @apply mr-20px mb-15px h-40px box-border flex flex-nowrap justify-center items-center;
    border-radius: 5px;
    background-color: #f5f5fa;
    padding: 0 15px !important;
    border: 1px solid transparent;

    &.is-selected {
      border: 1px solid $uni-color-primary;
    }
  }
}
</style>

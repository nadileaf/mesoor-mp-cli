<script lang="ts" setup>
import { formatDate } from '@/utils/format';
import dayjs from '@/utils/dayjs';

type Props = {
  modelValue?: Common.NormalizedField.Date | Common.DateType;
  //有效值 year、month、day，表示选择器的粒度，默认为 day
  fields?: 'month' | 'year' | 'day';
  triggerClass?: string;
  placeholder?: string;
  iso?: boolean;
};

type Emits = {
  (e: 'update:modelValue', date: Props['modelValue']): void;
};

const props = withDefaults(defineProps<Props>(), {
  fields: 'day'
});

const emits = defineEmits<Emits>();
const innerValue = computed(() => {
  let val = props.iso ? props.modelValue : undefined;
  if (props.modelValue && typeof props.modelValue === 'object' && 'iso' in props.modelValue) {
    val = props.modelValue.iso;
  }
  return formatDate(val, format.value);
});

const format = computed(() => {
  switch (props.fields) {
    case 'year':
      return 'YYYY';
    case 'month':
      return 'YYYY-MM';
    case 'day':
      return 'YYYY-MM-DD';
  }
});

function bindDateChange(e: any) {
  const date = dayjs(e.detail.value);
  const iso = date.format();
  const year = date.year();
  const day = date.day();
  const month = date.month();
  const value = props.iso
    ? iso
    : {
        iso,
        day,
        year,
        month
      };
  emits('update:modelValue', value);
}
</script>

<template>
  <picker mode="date" :value="innerValue" @change="bindDateChange" :fields="props.fields">
    <view class="flex items-center" :class="triggerClass">
      <text v-if="innerValue">{{ innerValue }}</text>
      <text v-else class="text-gray-400">{{ props.placeholder || '请选择时间' }}</text>
    </view>
  </picker>
</template>

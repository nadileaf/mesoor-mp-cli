<script lang="ts">
export default { name: 'MDateRangePicker' };
</script>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { message } from '@/utils/common';

type Props = {
  startTime: Common.DateType | undefined;
  endTime: Common.DateType | undefined;
};
type Emits = {
  (e: 'update:startTime', value: Props['startTime']): void;
  (e: 'update:endTime', value: Props['endTime']): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const _startTime = ref<Props['startTime']>('');
const _endTime = ref<Props['endTime']>('');

watchEffect(() => {
  _startTime.value = props.startTime || '';
  _endTime.value = props.endTime || '';
});

async function handleStartTimeChange(value: Common.DateType) {
  if (!value) {
    _startTime.value = '';
  } else if (dayjs(value).isAfter(dayjs(_endTime.value))) {
    message.error('开始时间不能大于结束时间!');
    await nextTick();
    _startTime.value = _endTime.value;
  }
  emits('update:startTime', _startTime.value ? dayjs(_startTime.value).startOf('day').format() : _startTime.value);
}

async function handleEndTimeChange(value: Common.DateType) {
  if (!value) {
    _endTime.value = '';
  } else if (dayjs(value).isBefore(dayjs(_startTime.value))) {
    message.error('结束时间不能小于开始时间!');
    await nextTick();
    _endTime.value = _startTime.value;
  }
  emits('update:endTime', _endTime.value ? dayjs(_endTime.value).endOf('day').format() : _endTime.value);
}
</script>

<template>
  <view class="m-date-range-picker">
    <uni-datetime-picker v-model="_startTime" type="date" returnType="date" placeholder="开始时间" @change="handleStartTimeChange" />
    ~
    <uni-datetime-picker v-model="_endTime" type="date" returnType="date" placeholder="结束时间" @change="handleEndTimeChange" />
  </view>
</template>

<style lang="scss" scoped>
.m-date-range-picker {
  @apply flex justify-between items-center gap-8px;
}
</style>

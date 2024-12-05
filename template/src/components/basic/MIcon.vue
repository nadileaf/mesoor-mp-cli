<script lang="ts">
export default { name: 'MIcon', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import type { IconTypes } from '@/assets/icons';

interface Props {
  type?: IconTypes;
  size?: number;
  color?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <uni-icons class="mui-icon" custom-prefix="iconfont" :type="props.type" :color="props.color || 'inherit'" :size="props.size"></uni-icons>
</template>

<style lang="scss" scoped></style>

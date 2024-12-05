<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { HOME_PAGE } from '@/config';

type Props = {
  size?: number;
  color?: string;
  customBackCb?: () => void;
};

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  color: '#0D0D26'
});

const router = useRouter();

const hasBackPage = computed(() => getCurrentPages().length > 1);

function handleBack() {
  if (props.customBackCb) {
    return props.customBackCb();
  }
  hasBackPage.value ? router.navigateBack() : router.reLaunch(HOME_PAGE);
}
</script>

<template>
  <uni-icons :type="hasBackPage ? 'back' : 'home'" :color="color" :size="size" class="back-btn" @click="handleBack" />
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { ref } from 'vue';
import { THEME_COLOR } from '@/config';
import { setNavigationBarTitle } from '@/utils/common';

interface Props {
  url?: string;
  title?: string;
}

const props = defineProps<Props>();

const webviewStyles = ref({
  progress: {
    color: THEME_COLOR
  }
});

watchEffect(() => setNavigationBarTitle(props.title ?? ''));

const websiteRegExp = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;

const src = computed(() => (websiteRegExp.test(props.url ?? '') ? props.url : decodeURIComponent(props.url ?? '')));
</script>

<template>
  <web-view v-if="src" :src="src" :webview-styles="webviewStyles"></web-view>
</template>

<style lang="scss" scoped></style>

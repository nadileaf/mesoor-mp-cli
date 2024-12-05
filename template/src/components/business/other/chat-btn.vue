<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { generateUrl } from '@/utils/common';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

function handleOpenChat() {
  router.push('/packages/common/web-view', {
    query: {
      url: generateUrl(import.meta.env.VITE_CHAT_URL, {
        token: authStore.token
      }),
      title: 'AI德小筑'
    }
  });
}
</script>

<template>
  <view class="float-btn__default bottom-50px" @click.stop="handleOpenChat()">AI德小筑</view>
</template>

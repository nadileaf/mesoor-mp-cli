<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

import { checkVersionUpdate } from '@/utils/common';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore, useAppStore } from './stores';

const appStore = useAppStore();

onLaunch(async (props) => {
  checkVersionUpdate();
  // initLocation();
  appStore.initAppLayoutInfo();
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style></style>

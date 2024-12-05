import { onShareAppMessage, onShow } from '@dcloudio/uni-app';

import { generateUrl } from '@/utils/common';
import { useAuthStore } from '@/stores';
import { HOME_PAGE } from '@/config';
import { type MaybeRef, unref } from 'vue';

/**
 * @description 默认分享
 * 注意 ！！！ 必须要分享的入口页面中显式 import { onShareAppMessage } from '@dcloudio/uni-app'; 才能生效，组件内部的onShareAppMessage不会生效
 */

export function useShare(params?: { title?: MaybeRef<string>; path?: MaybeRef<string>; imageUrl?: MaybeRef<string> | 'default' }) {
  const authStore = useAuthStore();

  const targetPath = computed(() => unref(params?.path) || HOME_PAGE);

  const sharePath = computed(() =>
    generateUrl(`/pages/index/launch`, {
      redirect: targetPath.value,
      sharer: (authStore.nickName || '') + ' ' + authStore.user?.username
    })
  );

  onShow(() => !authStore.isNormalUser && uni.hideHomeButton());

  onShareAppMessage(() => {
    console.log('targetPath', targetPath.value);
    console.log('sharePath', sharePath.value);

    let _title = unref(params?.title) || '';
    if (targetPath.value.includes('/packages/entity/detail/index') && targetPath.value.includes('entityType=Resume'))
      _title = _title.substring(0, 1) + '**的简历';

    return {
      title: _title || '办公无界 效率无限',
      path: sharePath.value,
      imageUrl:
        params?.imageUrl === 'default '
          ? undefined
          : unref(params?.imageUrl) ?? 'https://cdn-fe.mesoor.com/custom/cgl/assets/logo/logo-share.png'
    };
  });
}

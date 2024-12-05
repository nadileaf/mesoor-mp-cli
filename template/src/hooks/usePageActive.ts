import { onShow, onHide } from '@dcloudio/uni-app';

export function usePageActive() {
  const isPageActive = ref(true);

  onShow(() => {
    isPageActive.value = true;
  });

  onHide(() => {
    isPageActive.value = false;
  });

  return { isPageActive };
}

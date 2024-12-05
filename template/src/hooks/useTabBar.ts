import { onShow } from '@dcloudio/uni-app';
import { useRouter } from '@/hooks/useRouter';
import { useAuthStore } from '@/stores';

export const useTabBar = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  onShow(() => {
    if (!authStore.isNormalUser) {
      console.log('auth error', authStore.user);
      // router.reLaunch('/pages/auth/error');
    }
    // checkAuthRoute();
  });
};

import { authService } from '@/services/auth';
import { useAuthStore, useUserStore } from '@/stores';
import { useRouter } from './useRouter';
import { confirm } from '@/utils/common';

export const useAuth = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  /** 有或没有token情况下，尝试直接登录 */
  async function tryLogin() {
    console.log('tryLogin', authStore.token);
    if (!authStore.token) {
      await authService.login();
    }
    await initAuthorizedApp();
  }

  /** 根据身份注册 */
  async function register() {
    try {
      await authService.register();
      await initAuthorizedApp();
    } catch (error) {
      console.error(error);
    }
  }

  /** 被邀请加入B端租户 */
  async function joinTenant(params: { tenantId: string; inviterId: string }) {
    await authService.joinTenant(params);
    await initAuthorizedApp();
  }

  /** 登录后初始化数据 */
  async function initAuthorizedApp() {
    await authService.getUserInfoByToken();
    await checkTargetTenant();
    userStore.getUsers();
  }
  async function checkTargetTenant() {
    if (authStore.isTargetTenant) return;
    const tenants = await authService.getJoinedTenants();
    const targetTenant = tenants.find((item) => item.tenantAlias === import.meta.env.VITE_AUTH_TENANT_ID);
    if (targetTenant) {
      await confirm(`当前所登录的租户为${authStore.user?.currentTenant?.tenantName},是否切换到${targetTenant.tenantName}租户?`);
      await authService.switchTenant({
        tenantId: import.meta.env.VITE_AUTH_TENANT_ID
      });
      await authService.getUserInfoByToken();
      useRouter().reLaunch('/pages/index/index');
    }
  }

  return { tryLogin, register, joinTenant };
};

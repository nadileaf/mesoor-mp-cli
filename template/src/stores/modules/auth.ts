// import { AUTH_PAGE } from '@/config';
import { useRouter } from '@/hooks/useRouter';
import { AuthMap } from '@/models/auth';
import { entityService } from '@/services/entity';
import { defineStore } from 'pinia';

interface State {
  loading?: boolean;
  clientOpenId?: string;
  phoneNumber?: string;
  token?: string;
  user?: UserModel.User;
  systemEmployee?: SystemEmployeeModel.SystemEmployee;
  client: 'weixin';
  privacyAgreementConfirmed: boolean;
  /** 邀请人 */
  inviterId?: string;
  /** 分享人 */
  sharer?: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    loading: false,

    get clientOpenId() {
      return uni.getStorageSync('clientOpenId');
    },
    set clientOpenId(clientOpenId: State['clientOpenId']) {
      uni.setStorageSync('clientOpenId', clientOpenId);
    },
    phoneNumber: undefined,
    token: import.meta.env.VITE_LOCAL_TOKEN || '',

    user: undefined,
    systemEmployee: undefined,
    client: 'weixin',
    get privacyAgreementConfirmed() {
      return uni.getStorageSync('privacyAgreementConfirmed') ?? false;
    },
    set privacyAgreementConfirmed(privacyAgreementConfirmed: boolean) {
      uni.setStorageSync('privacyAgreementConfirmed', privacyAgreementConfirmed);
    }
  }),
  getters: {
    tenant: (state) => state.user?.currentTenant?.tenantAlias || import.meta.env.VITE_AUTH_TENANT_ID,
    isTargetTenant: (state) => state.user?.currentTenant?.tenantAlias === import.meta.env.VITE_AUTH_TENANT_ID,
    tenantMemberId: (state) => `${state.user?.currentTenant?.tenantAlias}T${state.user?.userId}`,
    /** 是否是tip正常用户(非游客) */
    isNormalUser: (state) => state.user?.tenantMemberStatus === 'normal',
    hasPhoneNumber: (state) => !!state.phoneNumber || !!state.user?.phone,
    unauthorized: (state) => !state.loading && !state.token,
    /** @description 当权用户权限 */
    authOf: (state) => {
      const res = {} as AuthModel.AuthOf;
      const auths = state.user?.userAuths || [];
      for (const [k, v] of Object.entries(AuthMap)) {
        res[k as keyof AuthModel.AuthMap] = auths.some((auth) => auth.authId == v);
      }
      return res;
    },
    isTeamLeader: (state) => !!state.user?.userRoles?.some((role) => role.roleName === '团队长'),
    isKcyCustomer: (state) => state.user?.userRoles?.some((role) => role.roleGenId === 'kcy_customer'),
    /** 海外兵团 */
    isOverseasTalentTeams: (state) => state.user?.userRoles?.some((role) => role.roleGenId === 'overseas_talent'),
    teamId: (state) => state.systemEmployee?.data.standardFields.employeeInfo?.teamId,
    nickName: (state) => state.systemEmployee?.data.standardFields.humanInfo?.nickname,
    employeeInfo: (state) => state.systemEmployee?.data.standardFields.employeeInfo
  },
  actions: {
    async setClientOpenId(openId: string) {
      this.clientOpenId = openId;
    },
    setPhoneNumber(phoneNumber: string) {
      this.phoneNumber = phoneNumber;
    },
    setToken(token?: string) {
      this.token = token;
      this.user = undefined;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setUser(user: UserModel.User) {
      this.user = user;
      this.setSystemEmployee();
    },
    setSystemEmployee(employee?: SystemEmployeeModel.SystemEmployee) {
      if (employee) {
        this.systemEmployee = employee;
        return;
      }

      if (!this.user) return;

      entityService
        .queryDetail<'SystemEmployee'>({
          entityId: this.user.userId,
          entityType: 'SystemEmployee'
        })
        .then((res) => {
          console.log('SystemEmployee :>> ', res);
          this.systemEmployee = res;
        })
        .catch((err) => {
          console.log(`Query SystemEmployee failed ${err}`);
        });
    },

    updateUserBasicInfo(user: Partial<Pick<UserModel.User, 'username' | 'avatar'>>) {
      if (!this.user) return;
      if (user.username) this.user.username = user.username;
      if (user.avatar) this.user.avatar = user.avatar;
    },
    confirmPrivacyAgreement() {
      this.privacyAgreementConfirmed = true;
    },
    logout() {
      this.setToken(undefined);
      // useRouter().push(AUTH_PAGE);
      uni.clearStorageSync();
    },
    setInviterId(val: string) {
      this.inviterId = val;
    },
    setSharer(val?: string) {
      this.sharer = val;
    }
  }
});

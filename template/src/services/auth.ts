import { MP_WX_ENV } from '@/config';
import { request, mesoorUserPrefixUrl } from '@/services';
import { useAuthStore } from '@/stores';
import { message } from '@/utils/common';

type LoginParams = {
  tenantId: string;
  phone: string;
  wxOpenId: string;
  username?: string;
  avatar?: string;
  source: string;
  inviterId?: string;
};

export type JoinTenantParams = {
  tenantId: string;
  inviterId: string;
  userId?: string;
  username?: string;
};

export const authService = {
  async loginWx() {
    const authStore = useAuthStore();
    if (authStore.clientOpenId) return authStore.clientOpenId;
    const { code } = await uni.login({ provider: authStore.client });
    if (!code) return Promise.reject('no code');
    const { openid } = await request.get<{ openid: string }>(
      mesoorUserPrefixUrl(`/wx/miniApp/login`),
      { code },
      { handleResponseData: false }
    );
    if (!openid) return Promise.reject('no openid');
    authStore.setClientOpenId(openid);
    return openid;
  },

  async checkUserByPhone() {
    const openId = await this.loginWx();
    const result = await request.get<{
      phone?: string;
      lastLogin: string;
      tenants: string[];
    }>(mesoorUserPrefixUrl(`/wx/miniApp/phone/check`), { openId }, { handleResponseData: false, hideErrorMessage: true });
    //没有注册过
    if (!result.phone) return Promise.reject('no phone');

    const authStore = useAuthStore();
    authStore.setPhoneNumber(result.phone);
    return result;
  },

  async register() {
    await this.checkUserByPhone();
    await this.authUser();
  },

  async login() {
    const { lastLogin } = await this.checkUserByPhone();

    if (lastLogin === import.meta.env.VITE_AUTH_TENANT_ID) {
      await this.authUser();
    } else {
      return Promise.reject('no target tenant');
    }
  },

  async authUser() {
    const authStore = useAuthStore();
    const { phoneNumber = '', clientOpenId = '', client, inviterId } = authStore;

    console.log('注册邀请人inviterId：', inviterId);

    const params: LoginParams = {
      tenantId: import.meta.env.VITE_AUTH_TENANT_ID,
      phone: phoneNumber,
      wxOpenId: clientOpenId,
      source: client,
      username: '',
      avatar: '',
      inviterId
    };
    // /authentication/cgl/union
    const { token } = await request.post<UserModel.User>(mesoorUserPrefixUrl(`/authentication/cgl/union`), params, {
      handleResponseData: false,
      hideErrorMessage: true
    });

    if (!token) {
      message.error('您还未注册过CGL用户');
      return Promise.reject('no token');
    }

    authStore.setToken(token);
    // getUserInfoByToken 里 setUser，没必要两次
    // authStore.setUser(user);
  },

  /** @deprecated 微信小程序已经获取不到真实user */
  async getUserInfo(): Promise<UniApp.GetUserProfileRes> {
    const lang = 'zh_CN';
    const authStore = useAuthStore();
    return new Promise((success, fail) =>
      uni.getUserProfile
        ? uni.getUserProfile({ desc: '用于完善会员资料', lang, success, fail })
        : uni.getUserInfo({ provider: authStore.client, lang, success, fail })
    );
  },

  async getPhoneNumber(code: string) {
    const openId = await this.loginWx();
    const phoneNumber = await request.get<string>(
      mesoorUserPrefixUrl(`/wx/miniApp/phone`),
      { code, openId },
      { handleResponseData: false }
    );
    console.log('获取手机号成功: ' + phoneNumber);
    const authStore = useAuthStore();
    authStore.setPhoneNumber(phoneNumber);
  },

  async getUserInfoByToken() {
    const authStore = useAuthStore();
    authStore.setLoading(true);
    try {
      const user = await request.get<UserModel.User>(mesoorUserPrefixUrl('/users/token/user'), undefined, {
        handleResponseData: false
      });
      console.log(user);
      authStore.setUser(user);
      return user;
    } catch (error) {
      console.error(error);
      authStore.logout();
    } finally {
      authStore.setLoading(false);
    }
  },

  async getJoinedTenants() {
    const { tenants } = await request.get<{ tenants: UserModel.Tenant[] }>(
      mesoorUserPrefixUrl('/users/tenants'),
      { current: 1, pageSize: 1000 },
      { handleResponseData: false }
    );
    return tenants;
  },
  async joinTenant(params: JoinTenantParams) {
    return this._createTenant(params);
  },
  /**
   * @description 切换租户
   */
  async switchTenant(params: { tenantId: string }) {
    return this._createTenant(params);
  },
  /**
   * @description 创建租户/补充租户资料/切换租户公共接口
   */
  async _createTenant(params: { tenantId: string; inviterId?: string; userId?: string; username?: string }) {
    const { token } = await request.post<{ token: string }>(
      mesoorUserPrefixUrl('/tenants'),
      {
        ...params,
        registerStatus: params.tenantId === 'share' ? 'miniapp_c' : undefined
      },
      { handleResponseData: false }
    );
    if (!token) return Promise.reject('token error');
    const authStore = useAuthStore();
    authStore.setToken(token);
  },

  /**
   * @description 发送订阅消息通知
   */
  async sendSubscribeMessage(params: { userID: string; templateId: string; redirectPage: string; data: object }) {
    const _params = {
      openId: null, // 就是null
      miniprogram_state: MP_WX_ENV,
      userId: params.userID,
      templateId: params.templateId,
      page: params.redirectPage,
      data: params.data
    };

    const resp = await request.post(mesoorUserPrefixUrl(`/wx/miniApp/message/subscribe`), _params, {
      handleResponseData: false
    });

    console.log('发送订阅消息通知返回结果', resp);
  }
};

import { mesoorUserPrefixUrl, mesoorSpacePrefixUrl, request } from '.';
import { authService } from './auth';
import { MP_WX_ENV } from '@/config';

type UserStatistics = {
  /** B端沟通过 */
  communication: number;
  /** B端职位 */
  entity: number;
  /** 收藏 */
  favorite: number;
};

export const userService = {
  async query() {
    const { users } = await request.get<{ users: UserModel.User[] }>(
      mesoorUserPrefixUrl('/users/user'),
      { current: 1, pageSize: 9000 },
      { handleResponseData: false }
    );
    return users;
  },
  delete(userId: string) {
    return request.delete(mesoorUserPrefixUrl(`/tenants/${userId}/user`));
  },
  async getStatistics() {
    return request.get<UserStatistics>(mesoorSpacePrefixUrl(`/wanda/v1/counts`));
  },

  /**
   * @description 更新用户信息
   */
  async updateUserInfo(
    params: Partial<{
      username: string;
      email: string;
      avatarBg: string;
      avatar?: string;
      tenantName: string;
    }>
  ) {
    await request.put(mesoorUserPrefixUrl('/users/profile'), params);
    await authService.getUserInfoByToken();
  },
  /** 下载二维码 */
  async downloadQRCode(params: { page: string; scene: string }) {
    return request.download(mesoorUserPrefixUrl('/wx/miniApp/qrcode/unlimited'), {
      ...params,
      check_path: false,
      env_version: MP_WX_ENV
    });
  }
};

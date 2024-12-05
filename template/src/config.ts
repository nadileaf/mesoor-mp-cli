import { pages, subPackages } from '@/pages.json';
import { appId } from './../package.json';
import { withCdnPrefix } from './utils/file';

export const APP_ID = appId;

/** 主题色 */
export const THEME_COLOR = '#356899';
/** 背景色 */
export const BG_COLOR = '#f9f9fd';

/** 全局title */
export const APP_DEFAULT_TITLE = 'CGL';

/** 首页 */
export const HOME_PAGE: RoutePages.Path = '/pages/index/index';

/** 认证页 */
// export const AUTH_PAGE: RoutePages.Path = '/pages/auth/register-B';

/** tab_bar 页面 */
// export const TAB_BAR_PAGES = tabBar.list.map(
//   (item) => `/${item.pagePath}` as RoutePages.Path
// );
export const TAB_BAR_PAGES: string[] = [];

/** 无需授权页面，白名单 */
export const UNAUTH_PAGES = ['/pages/index/launch', '/pages/auth/*', '/packages/job-hopping/*'];

export const MP_WX_ENV =
  import.meta.env.VITE_RUNTIME_ENV === 'test' ? 'trial' : import.meta.env.VITE_RUNTIME_ENV === 'development' ? 'develop' : 'release';

console.log('MP_WX_ENV', MP_WX_ENV);

export const WX_SUBSCRIBE_MESSAGE_TEMPLATES = {
  unreadMessage: 'GiyU4ebn0OLAMQps045GLALB8DZMGV2ieYV24oj4c5k'
};

export const DEFAULT_AVATAR_PATH = withCdnPrefix('/tip-assets/img/icons/default-avatar.png');

import { reactive } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { generateUrl, decodeUrlQuery, getCurrentPage } from '@/utils/common';
import { TAB_BAR_PAGES, UNAUTH_PAGES, HOME_PAGE } from '@/config';
// import { useAuthStore } from '@/stores';

/** @name 跳转的page路径 */
export type RouterUrl = RoutePages.Path;
/**
 * @name 路由可选项
 * @param query 路由上的query
 * @param data 往下个页面传递复杂的数据，支持各种数据类型，包括回调方法
 */
type RouterOptions = {
  //路由上的query
  query?: Record<string, string | string[] | undefined>;
  //往下个页面传递复杂的数据
  data?: any;
};

const _routerData = new Map<RouterUrl, RouterOptions['data']>();

/** @deprecated 已废弃，请使用defineProps获取路由query */
export const useRoute = () => {
  const route = reactive<{ query: RouterOptions['query'] }>({ query: {} });
  onLoad((data: RouterOptions['query']) => {
    route.query = decodeUrlQuery(data);
  });
  return route;
};

export const useRouter = <T>() => {
  const currentPageUrl = `/${getCurrentPage()?.route}` as RouterUrl;

  const data: T | undefined = _routerData.get(currentPageUrl);

  //离开页面删除data
  onUnload(() => {
    _routerData.delete(currentPageUrl);
  });

  return {
    currentPageUrl,
    routerData: data,
    push(url: RouterUrl, options?: RouterOptions) {
      // if (!checkAuthRoute(url, options?.query)) return;
      const _url = generateUrl(url, options?.query);
      initData(url, options);
      if (TAB_BAR_PAGES.includes(url)) return uni.switchTab({ url: _url });
      return uni.navigateTo({ url: _url });
    },
    replace(url: RouterUrl, options?: RouterOptions) {
      // if (!checkAuthRoute(url, options?.query)) return;
      initData(url, options);

      const _url = generateUrl(url, options?.query);
      if (TAB_BAR_PAGES.includes(url)) return uni.switchTab({ url: _url });
      console.log('replace', _url);
      return uni.redirectTo({ url: _url });
    },
    reLaunch(url: RouterUrl, options?: RouterOptions) {
      // if (!checkAuthRoute(url)) return;
      initData(url, options);
      return uni.reLaunch({ url: generateUrl(url, options?.query) });
    },
    /** @description 页面后退，默认回到上一页，支持指定回调到tryBackPage，如果路由栈不存在tryBackPage，则返回上一页 */
    navigateBack(tryBackPage?: RouterUrl, options?: { failBackPage: RouterUrl; failBackPageOptions?: RouterOptions }) {
      let delta = 1;
      const pages = getCurrentPages().map((item) => item.route);
      if (tryBackPage) {
        // if (!checkAuthRoute(tryBackPage)) return;
        const index = pages.findIndex((item) => `/${item}` === tryBackPage);
        console.log(pages, index);
        if (index >= 0) delta = pages.length - 1 - index;
        else if (options?.failBackPage) {
          // if (!checkAuthRoute(options.failBackPage)) return;
          return this.replace(options.failBackPage, options.failBackPageOptions);
        }
      }
      return pages.length > 1 ? uni.navigateBack({ delta }) : this.replace(HOME_PAGE);
    }
  };
};
function initData(url: RouterUrl, options?: RouterOptions) {
  if (options?.data) _routerData.set(url, options?.data);
}

// function redirectToAuthPage(url?: RouterUrl, query?: RouterOptions['query']) {
//   const redirectUrl = url ? generateUrl(AUTH_PAGE, { redirect: generateUrl(url, query) }) : AUTH_PAGE;
//   uni.redirectTo({ url: redirectUrl });
// }

// function matchWildcardPath(path: string, pattern: string): boolean {
//   if (pattern.endsWith('/*')) {
//     const prefix = pattern.slice(0, -2);
//     return path.startsWith(prefix);
//   }
//   return path === pattern;
// }

// export function checkAuthRoute(url?: RouterUrl, query?: RouterOptions['query']) {
//   const authStore = useAuthStore();
//   const currentPageRoute = `/${getCurrentPage()?.route}` as RouterUrl;

//   const needsAuth = !UNAUTH_PAGES.some((pattern) => matchWildcardPath(url ?? currentPageRoute, pattern)) && !authStore.token;

//   if (needsAuth) {
//     redirectToAuthPage(url, query);
//     return false;
//   }
//   return true;
// }

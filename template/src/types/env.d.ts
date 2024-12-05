/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_URL: string;
  /** 本地测试token */
  readonly VITE_LOCAL_TOKEN: string;
  /** 指定授权租户 */
  readonly VITE_AUTH_TENANT_ID: string;
  /** 用户服务协议url */
  readonly VITE_USER_SERVICE_URL: string;
  /** 隐私政策url */
  readonly VITE_PRIVACY_URL: string;
  /** 高德地图key */
  readonly VITE_AMAP_KEY: string;
  /** 静态资源前缀 */
  readonly VITE_STATIC_ASSETS_PREFIX: string;
  /** attachment cdn prefix */
  readonly VITE_ATTACHMENT_CDN_PREFIX: string;
  /** attachment inner prefix */
  readonly VITE_ATTACHMENT_INNER_PREFIX: string;

  readonly VITE_RUNTIME_ENV: 'development' | 'test' | 'production';
  readonly VITE_CHAT_URL: string;
  readonly VITE_LAUNCH_COUNTER_SECONDS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// interface Uni {
//   // uni properties
// }

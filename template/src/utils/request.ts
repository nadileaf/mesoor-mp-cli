import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores';
import { message } from '@/utils/common';
import { generateUrl } from '@/utils/common';
import { APP_ID } from '@/config';

let prefixUrl = (url: string) => (url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`);

// #ifdef H5
prefixUrl = (url: string) => (url.startsWith('http') ? url : `${location?.protocol}//${location?.host}${url}`);
// #endif

type RequestParams = { [key: string]: unknown } | Array<{ [key: string]: unknown }> | FormData | undefined;

export interface RequestOptions extends UniApp.RequestOptions {
  handleResponseData?: boolean;
  hideErrorMessage?: boolean;
}

export interface UploadFileOptions extends UniApp.UploadFileOption {
  handleResponseData?: boolean;
  hideErrorMessage?: boolean;
}

export interface ResponseData<T> {
  timestamp?: string;
  message?: string;
  data?: T;
  error?: string;
}

class Request {
  private static instance: Request;

  private constructor() {
    //do nothing
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Request();
    }
    return this.instance;
  }

  private transformOption(option: RequestOptions) {
    const { token } = useAuthStore();
    if (!token && /\/api\/mesoor-space\/.*$/.test(option.url)) {
      option.url = option.url.replace(`/api/mesoor-space`, `/mesoor-space`);
    }

    option.url = prefixUrl(option.url);
    option.header = this.transformHeader(option.header);
    return option;
  }
  private transformHeader(header: RequestOptions['header']) {
    const { token, client, clientOpenId, user, tenant } = useAuthStore();

    const _header = {
      ...header,
      Client: client,
      'App-Id': APP_ID,
      'Tenant-Member-Status': user?.tenantMemberStatus,
      'Tenant-Id': tenant
    };

    if (!_header.Authorization && token) _header.Authorization = `Bearer ${token}`;
    else _header['User-Id'] = clientOpenId || 'unknown';
    return _header;
  }

  private async _request<T>(op: RequestOptions): Promise<T> {
    const option = this.transformOption(op);
    !import.meta.env.DEV && console.log(`🚀 request ${option.method}：${option.url}`, option.data);
    const result = await this.tokenRequest<T>({
      ...option,
      handleResponseData: true
    });
    !import.meta.env.DEV && console.log(`🚀 response ${option.method}：${option.url}`, result);
    return this.handleResponse<T>(result, option);
  }

  private async handleResponse<T>(
    {
      statusCode,
      data
    }: Omit<UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult, 'data'> & {
      data: ResponseData<T>;
    },
    option: RequestOptions | UploadFileOptions
  ) {
    if (!statusCode.toString().startsWith('2')) {
      this.handleError(option, data, statusCode);
      return Promise.reject({ statusCode, data });
    }

    if (option.handleResponseData === false) return data as T;
    else return data.data as T;
  }

  private async handleAuthError() {
    try {
      await authService.login();
    } catch (error) {
      useAuthStore().logout();
      return Promise.reject(401);
    }
  }
  async handleError(option: RequestOptions | UploadFileOptions, error: any, code?: number) {
    switch (code) {
      case 401:
        this.handleAuthError();
        break;
      case 403:
        message.error('您没有权限访问该资源');
        break;
      case 404:
        !option?.hideErrorMessage && message.error('网络可能异常，请稍后重试');
        break;
      default:
        !option?.hideErrorMessage && message.error(error.message || '＞﹏＜ 服务异常，请稍后重试');
        console.error(code, option.url, error);
        break;
    }
  }

  private async tokenRequest<T>(option: RequestOptions) {
    try {
      return (await uni.request(option)) as unknown as UniApp.RequestSuccessCallbackResult & {
        data: ResponseData<T>;
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get<T>(url: string, data?: RequestParams, option?: Partial<RequestOptions>) {
    return this._request<T>({ ...option, method: 'GET', url, data });
  }

  post<T>(url: string, data?: RequestParams, option?: Partial<RequestOptions>) {
    return this._request<T>({ ...option, method: 'POST', url, data });
  }

  put<T>(url: string, data?: RequestParams, option?: Partial<RequestOptions>) {
    return this._request<T>({ ...option, method: 'PUT', url, data });
  }

  patch<T>(url: string, data?: RequestParams, option?: Partial<RequestOptions>) {
    return this._request<T>({
      ...option,
      header: { ...option?.header, ProxyMethod: 'PATCH' },
      method: 'PUT',
      url,
      data
    });
  }

  delete<T>(url: string, data?: RequestParams, option?: Partial<RequestOptions>) {
    return this._request<T>({ ...option, method: 'DELETE', url, data });
  }

  async upload<T>(
    url: string,
    option?: Omit<UniApp.UploadFileOption, 'url'> & {
      onUploadProgress?: (e: UniApp.OnProgressUpdateResult) => void;
    }
  ) {
    return new Promise<T>((resolve, reject) => {
      const _options = {
        ...option,
        url: prefixUrl(url),
        name: 'file',
        header: this.transformHeader(option?.header)
      };
      const result = uni.uploadFile({
        ..._options,

        success: (res) => {
          const resData = (typeof res.data === 'string' ? JSON.parse(res.data) : res.data) as ResponseData<T>;

          this.handleResponse({ ...res, data: resData }, _options)
            .then(resolve)
            .catch(reject);
        },
        fail(err) {
          message.error('上传失败，请稍后重试！');
          console.log('upload fail', err);
          reject(err);
        }
      });
      if (option?.onUploadProgress) {
        result.onProgressUpdate(option.onUploadProgress);
      }
    });
  }

  async download(url: string, data?: RequestParams, option?: Partial<RequestOptions>) {
    let downloadUrl = prefixUrl(url);
    if (data) {
      downloadUrl = generateUrl(downloadUrl, data);
    }
    return new Promise<UniApp.DownloadSuccessData>((resolve, reject) => {
      uni.downloadFile({
        ...option,
        url: downloadUrl,

        header: this.transformHeader(option?.header),
        success(res) {
          if (res.statusCode !== 200) reject();
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }
}

export default Request.getInstance();

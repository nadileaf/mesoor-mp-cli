/* eslint-disable @typescript-eslint/ban-ts-comment */
import { get } from 'lodash-es';

/** 小程序版本更新检查 */
export function checkVersionUpdate() {
  // #ifndef H5
  const updateManager = uni.getUpdateManager();
  updateManager.onUpdateReady(async () => {
    await confirm('新版本已经准备好，是否重启应用？', '更新提示');
    updateManager.applyUpdate();
  });
  // #endif
}

export function getNavigationInfo() {
  const info = { statusBarHeight: 20, navigationBarHeight: 44 };

  try {
    const sysInfo = uni.getSystemInfoSync();
    console.log(sysInfo, uni.getMenuButtonBoundingClientRect);
    const menuInfo = uni.getMenuButtonBoundingClientRect();
    info.statusBarHeight = sysInfo?.statusBarHeight ?? 0;
    info.navigationBarHeight = (menuInfo.top - (sysInfo.statusBarHeight ?? 0)) * 2 + menuInfo.height;
  } catch (error) {
    info.statusBarHeight = 0;
  }
  console.log(info);
  return info;
}

export function setNavigationBarTitle(title: string) {
  uni.setNavigationBarTitle({
    title: decodeURIComponent(decodeURIComponent(title))
  });
}

export function getCurrentPage() {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  return page;
}

export const loadingModal = {
  show(option?: { title?: string; mask?: boolean }) {
    uni.showLoading({ title: option?.title || '加载中', mask: option?.mask });
  },
  hide() {
    uni.hideLoading?.();
  }
};

export async function confirm(content: string, title = '提示') {
  return new Promise<void>((resolve, reject) => {
    uni.showModal({
      title,
      content,
      success(res) {
        if (res.confirm) return resolve();
        else if (res.cancel) return reject();
      }
    });
  });
}

export function alert(content: string, title = '提示') {
  return new Promise<void>((resolve) => {
    uni.showModal({
      title,
      content,
      showCancel: false,
      success(res) {
        if (res.confirm) return resolve();
      }
    });
  });
}

export const message = {
  success(title: string, option?: { position?: 'top' | 'center' | 'bottom'; duration?: number }) {
    _message(title, { icon: 'success', ...option });
  },
  error(title: string, option?: { position?: 'top' | 'center' | 'bottom'; duration?: number }) {
    //error icon 不太友好，改为none
    _message(title, { icon: 'none', ...option });
  },
  info(title: string, option?: { position?: 'top' | 'center' | 'bottom'; duration?: number }) {
    _message(title, { icon: 'none', ...option });
  }
};
function _message(
  title: string,
  option?: {
    icon?: 'success' | 'error' | 'loading' | 'none';
    position?: 'top' | 'center' | 'bottom';
    duration?: number;
    delay?: number;
  }
) {
  setTimeout(() => {
    uni.showToast({
      title,
      icon: option?.icon || 'none',
      position: option?.position || 'top',
      duration: option?.duration ?? 2000
    });
  }, option?.delay ?? 300);
}

export function copyText(text: string | undefined) {
  if (!text) return;
  return new Promise<void>((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      showToast: false,
      success() {
        uni.showToast({ title: '复制成功', icon: 'success' });
        resolve();
      },
      fail() {
        uni.showToast({ title: '复制失败', icon: 'none' });
        reject('复制失败');
      }
    });
  });
}

export function generateUrl(url = '', query?: Record<string, any>) {
  if (!query) return url;
  const _result = [];
  for (const key in query) {
    const value = query[key];
    // 去掉为空的参数
    if ([undefined, null, ''].includes(value)) continue;
    if (Array.isArray(value)) {
      value.forEach((_value) => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  const _query = _result.join('&');
  if (_query) url += url.indexOf('?') === -1 ? '?' : '&';
  return url + _query;
}

export function decodeUrlQuery<T extends Record<string, string | string[] | undefined>>(query?: T) {
  const result = {} as T;
  if (query && typeof query === 'object') {
    for (const key in query) {
      const value = query[key];
      // 去掉为空的参数
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        result[key] = value.map((_value) => decodeURIComponent(_value)) as typeof value;
      } else {
        result[key] = decodeURIComponent(value) as typeof value;
      }
    }
  }
  return result;
}

export function getUrlQuery(url: string) {
  const queryObject: Record<string, string> = {};
  try {
    // 从 URL 中提取查询字符串部分
    const queryString = url.split('?')[1] || '';
    // 使用正则表达式匹配所有的键值对
    queryString.replace(/([^&=]+)=?([^&]*)/g, (match, key, value) => {
      // 对键和值进行解码
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);
      // 将解码后的键值对添加到结果对象中
      queryObject[decodedKey] = decodedValue;
      return match;
    });
  } catch (error) {
    console.error('Error parsing the URL query string:', error);
  }
  return queryObject;
}

export function getQueryString(queryObj: Record<string, string>) {
  const params = Object.entries(queryObj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return params;
}

export function delay(wait: number) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

export function choose(type: 'camera' | 'album' | 'file') {
  return new Promise<string>((resolve, reject) => {
    const config = {
      count: 1,
      fail() {
        reject();
      }
    };
    if (type === 'file') {
      // #ifdef MP-WEIXIN
      wx.chooseMessageFile({
        success(res) {
          const tempFilePaths = res.tempFiles;
          resolve(tempFilePaths[0].path);
        },
        ...config
      });
      // #endif

      // #ifdef H5
      uni.chooseFile({
        success(chooseImageRes) {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          resolve(tempFilePaths[0]);
        },
        ...config
      });
      // #endif
    } else {
      uni.chooseImage({
        sourceType: [type],
        success(chooseImageRes) {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          resolve(tempFilePaths[0]);
        },
        ...config
      });
    }
  });
}

/** key 为 键名，value 为 label */
export type Field = Map<string, string>;

/**
 * 表单验证
 * @description 验证通过返回 true，验证失败会 alert 对应的字段 label ，返回 false; needAlert 为 true 时会自动 alert
 */
export function validateForm(form: Record<string, any>, requiredFields: Field, options?: { needAlert?: boolean }) {
  const keys = requiredFields.keys();

  for (const key of keys) {
    const val = get(form, key);
    const isEmptyArr = Array.isArray(val) && !val.length;

    if ([undefined, null, ''].includes(val) || isEmptyArr) {
      const label = requiredFields.get(key);
      console.log('validate fail on =>', key, label, form);
      if (options?.needAlert) {
        message.info(`请完善${label}！`);
      }
      return false;
    }
  }
  return true;
}

export function validatePhoneNumber(phoneNumber: string) {
  return !/^[1][3-9][0-9]{9}$/.test(phoneNumber);
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function getDistance(pointA?: Coordinates, pointB?: Coordinates): number {
  if (!pointA || !pointB) return 0;
  const earthRadiusKm = 6371; // 地球半径，单位：千米

  function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  const latDiff = degreesToRadians(pointB.latitude - pointA.latitude);
  const lonDiff = degreesToRadians(pointB.longitude - pointA.longitude);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(degreesToRadians(pointA.latitude)) *
      Math.cos(degreesToRadians(pointB.latitude)) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = earthRadiusKm * c;
  return distanceKm;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const distanceMeters = Math.round(distanceKm * 1000);
    return `${distanceMeters}m`;
  } else {
    const distanceKilometers = distanceKm.toFixed(2);
    return `${distanceKilometers}km`;
  }
}

/**
 * 动态加载字体，加载结束后 resolve
 */
export function loadFontFace(family: string, source: string) {
  console.log('loadFontFace ' + family);
  return new Promise<void>((resolve) => {
    uni.loadFontFace({
      family,
      source,
      complete() {
        resolve();
      },
      success() {
        console.log('loadFontFace ' + family + ' success');
      },
      fail() {
        console.log('loadFontFace' + family + ' fail');
      }
    });
  });
}

export type ImageInfoData = UniApp.GetImageInfoSuccessData;
export function getImageInfo(src: string) {
  return new Promise<ImageInfoData>((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 由于lodash的debounce报错，写了个简单的防抖函数
 */
export function debounce(fn: () => void, wait: number, { leading = false }) {
  let timeout: number;

  return () => {
    if (leading && !timeout) {
      fn();
    }

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (!leading) {
        fn();
      }
    }, wait);
  };
}

export const throttle = (func: any, wait = 1000, type = 1) => {
  let previous = 0;
  let timeout: number | null;
  return function () {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (type === 1) {
      const now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
};

export function getContrastingTextColor(hexColor: string): string {
  hexColor = hexColor.replace(/^#/, '');
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

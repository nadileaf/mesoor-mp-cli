import dayjs from '@/utils/dayjs';
import { generateUrl } from './common';
import { useAuthStore } from '@/stores';
import { COSImageStyleHandler, fileTypes } from './file';
import { get, isEmpty } from 'lodash-es';

type TemplateType = 'YYYY-MM' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD hh:mm:ss' | string;

function _getTemplate(value: Common.DateType, template: TemplateType) {
  let _template = template;
  if (dayjs().isSame(value, 'year')) _template = _template.replace('YYYY-', '');
  if (dayjs(value).hour() === 0 && dayjs(value).minute() === 0) _template = _template.replace('HH:mm', '');
  return _template;
}

export const formatDate = (value: Common.NormalizedField.Date | Common.DateType | undefined, template: TemplateType = 'YYYY-MM-DD') => {
  let val: Common.DateType | undefined = undefined;
  if (value) {
    if (typeof value === 'object') 'iso' in value && !isEmpty(value.iso) && (val = value.iso);
    else val = value as Common.DateType;
  }
  return val ? dayjs(val).format(_getTemplate(val, template)) : '';
};

export const formatDeadlineTime = (
  start: Common.DateType | undefined,
  end: Common.DateType | undefined,
  template: TemplateType = 'YYYY-MM-DD HH:mm'
) => {
  if (start && end) {
    return start === end
      ? formatDate(start, template)
      : formatDate(start, template) + ' ~ ' + formatDate(end, dayjs(start).isSame(end, 'day') ? 'HH:mm' : template);
  } else if (start) return formatDate(start, template) + ' 开始';
  else if (end) return formatDate(end, template) + ' 截止';
};

export const formatFromNow = (value: Common.DateType | undefined, withoutSuffix?: boolean) => {
  if (!value) return;
  let res = dayjs(value).fromNow(withoutSuffix);
  const justNowRegex = /秒|分钟/;
  if (justNowRegex.test(res)) res = '刚刚';
  if (res.includes('小时')) res = withoutSuffix ? '1天' : '1天前';
  return res;
};

export const formatDateRange = (
  value: Common.NormalizedField.DateRange | { start?: Common.DateType; end?: Common.DateType; untilNow?: boolean } | undefined,
  template: TemplateType = 'YYYY-MM'
) => {
  if (!value) return '';
  const start = value?.start ? formatDate(value.start, template) : value.untilNow ? '' : '?';
  const end = value?.end ? formatDate(value.end, template) : value.untilNow ? '至今' : '?';
  const sep = end && start ? '-' : '';
  return start + sep + end;
};

export function formatDuration(value?: Common.NormalizedField.DateRange) {
  if (!value) return '';
  const { start, end, untilNow } = value;

  function getDurationYearsAndMonths(diff: number) {
    const durationYears = dayjs.duration(diff).years();
    const durationMonths = dayjs.duration(diff).months() % 12;
    return `${durationYears ? durationYears + '年' : ''}${durationMonths ? durationMonths + '个月' : ''}`;
  }

  if (start?.iso && end?.iso) {
    const diff = dayjs(end.iso).diff(start.iso);
    return getDurationYearsAndMonths(diff);
  }

  if (start?.iso && untilNow) {
    const diff = dayjs().diff(start.iso);
    return getDurationYearsAndMonths(diff);
  }

  return '';
}

/** @description 处理内部文件路径，可能是文件key / 完整的文件地址或者接口返回文件流 / base64 */
export function formatFileUrl(url?: string, option?: { forceCDN?: boolean }) {
  if (!url) return '';
  let _url = url;
  //相对路径拼接前缀
  if (!_url.startsWith('http')) {
    _url = import.meta.env.VITE_ATTACHMENT_CDN_PREFIX + (_url.startsWith('/') ? _url : `/${_url}`);
  }
  //强制使用cdn
  if (option?.forceCDN) {
    _url = _url.replace(import.meta.env.VITE_ATTACHMENT_INNER_PREFIX, import.meta.env.VITE_ATTACHMENT_CDN_PREFIX);
  }
  //是内部文件，拼接token
  if (
    (_url.startsWith(import.meta.env.VITE_ATTACHMENT_CDN_PREFIX) || _url.startsWith(import.meta.env.VITE_ATTACHMENT_INNER_PREFIX)) &&
    !_url.includes('token=') &&
    !_url.includes('clientId=')
  ) {
    const { token, clientOpenId: clientId } = useAuthStore();
    _url = generateUrl(_url, { token, clientId });
  }
  return _url;
}

export function formatImageUrl(url?: string, option?: { forceCDN?: boolean; size?: Common.ImageSize }) {
  const _url = formatFileUrl(url, option);
  if (
    option?.size &&
    (_url.startsWith(import.meta.env.VITE_ATTACHMENT_CDN_PREFIX) || _url.includes('cos.')) &&
    !_url.includes(COSImageStyleHandler[option.size])
  )
    return _url + (_url.includes('?') ? '&' : '?') + COSImageStyleHandler[option.size];
  return _url;
}

/** 获取视频封面 */
export function formatVideoCover(url?: string, option?: Parameters<typeof formatImageUrl>[1]) {
  if (!fileTypes.video.some((ext) => url?.includes(`.${ext}`))) return '';
  const _url = formatFileUrl(`${url}_cover.jpg`, option);
  return formatImageUrl(_url, option);
}

export const formatAgeString = (age?: string) => {
  if (!age) return '';
  return `${age}岁`;
};

export function formatField(value: string | undefined | null, params?: { trim?: boolean }) {
  let text = value || '';
  params?.trim && (text = text.replace(/[ \t]/g, ''));
  return text;
}

/**
 * @description 转化 location 编码值，结果一般展示 city 即可，有特殊需求可在 contains 中配置需要的字段
 * @param location Location | Location[] | undefined
 * @param contains ("country" | "province" | "city" | "district" | "address")[]
 * @default contains = ['city']
 */
export function formatLocation(
  location: Util.Arrayable<Common.NormalizedField.Location> | undefined,
  contains: (keyof Omit<Common.NormalizedField.Location, 'code' | 'postalCode' | 'region'>)[] = [
    'country',
    'province',
    'city',
    'district',
    'address'
  ]
) {
  let res = '';

  const isLocationArray = Array.isArray(location);

  if (!location || (isLocationArray && !location.length)) return res;

  const { address, country, province, city, district } = isLocationArray ? location[0] : location;

  contains.includes('country') && (res += country || '');
  contains.includes('province') && (res += province || '');
  contains.includes('city') && province !== city && (res += city || '');
  contains.includes('district') && (res += district || '');
  contains.includes('address') && (res += address || '');
  return formatField(res);
}

export function formatNumberRange(range?: Common.NormalizedField.IntRange, params?: { unit?: string }) {
  let result = '';
  const unit = params?.unit || '';
  if (range) {
    const { gt, lt } = range;
    if (gt && lt) {
      result = gt !== lt ? `${gt} ~ ${lt}${unit}` : `${gt}${unit}`;
    } else if (gt && !lt) {
      result = `${gt}${unit}以上`;
    } else if (!gt && lt) {
      result = `${lt}${unit}以下`;
    }
  }
  return formatField(result);
}

export const salaryPeriodMap = new Map<Common.NormalizedField.Salary['period'], string>([
  ['hour', '时'],
  ['day', '日'],
  ['week', '周'],
  ['month', '月'],
  ['year', '年']
]);

/** @description 格式化工资，默认带单位 */
export function formatSalaryRange(range?: Common.NormalizedField.SalaryRange) {
  let salaryRange = '';
  if (range) {
    const { gt, lt } = range;
    const gtAmount = !isNaN(gt?.amount?.number ?? 0) ? gt?.amount?.number : 0;
    const ltAmount = !isNaN(lt?.amount?.number ?? 0) ? lt?.amount?.number : 0;
    if (gtAmount && ltAmount) {
      salaryRange =
        gtAmount == ltAmount
          ? formatSalaryWithPeriod(ltAmount, lt?.period)
          : `${formatSalaryWithPeriod(gtAmount)} ~ ${formatSalaryWithPeriod(ltAmount, lt?.period)}`;
    } else if (gtAmount && !ltAmount) {
      salaryRange = `${formatSalaryWithPeriod(gtAmount)}以上`;
    } else if (!gtAmount && ltAmount) {
      salaryRange = `${formatSalaryWithPeriod(ltAmount, lt?.period)}以下`;
    }

    const months = lt?.months ?? gt?.months;
    months ? (salaryRange += ` · ${months}个月`) : '';
  }
  return formatField(salaryRange);
}
function formatSalaryWithPeriod(val: number, period?: Common.NormalizedField.Salary['period']) {
  return !isNaN(val) ? Number(val) / 1000 + 'K' + (period ? ` / ${salaryPeriodMap.get(period)}` : '') : '';
}

export function formatPhone(val?: string, params?: { hide?: boolean }) {
  if (!val) return '';
  const _val = val.replace(/^86/, '');
  if (params?.hide) {
    return _val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return _val;
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB: number = sizeInBytes / 1024;
    return `${sizeInKB.toFixed(0)} KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB: number = sizeInBytes / (1024 * 1024);
    return `${sizeInMB.toFixed(0)} MB`;
  } else {
    const sizeInGB: number = sizeInBytes / (1024 * 1024 * 1024);
    return `${sizeInGB.toFixed(0)} GB`;
  }
}

export function formatWorkMonths(months?: number) {
  if (!months) return;
  return Math.round(months / 12) + '年经验';
}

export const currencyUnits = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};
export function formatCurrency(val?: Common.NormalizedField.Currency | number | string) {
  if (!val) return '';
  else if (typeof val === 'string' || typeof val === 'number') return currency(val, { currency: currencyUnits['CNY'] });
  return currency(val.number ?? val.value, {
    currency: currencyUnits[val.unit || 'CNY']
  }).toString();
}
export function formatStringArray(object?: any[], fieldPath?: string, sep = '、') {
  if (!object?.length) return '';
  if (typeof object[0] === 'string' || typeof object[0] === 'number') return object.join(sep);
  else if (fieldPath) return object.map((i) => get(i, fieldPath)).join(sep);
}

export function formatFilterNumberRange(val: SearchModel.FilterValueRange, unit?: string) {
  if (!val.minimum) return `${val.maximum ?? 0}${unit ?? ''}以下`;
  else if (!val.maximum) return `${val.minimum ?? 0}${unit ?? ''}以上`;
  else return `${val.minimum}~${val.maximum ?? 0}${unit ?? ''}`;
}
export function formatFilterDateRange(val: SearchModel.FilterValueRange, template = 'YYYY-MM-DD') {
  if (!val.minimum) return `小于${formatDate(val.maximum, template)}`;
  else if (!val.maximum) return `大于${formatDate(val.minimum, template)}`;
  else return formatDateRange({ start: val.minimum, end: val.maximum }, template);
}

/** 处理 path 值，取最后一个 '-' 后的值 */
export function formatPathValue(val: string) {
  const index = val.lastIndexOf('-');
  return index === -1 ? val : val.substring(index + 1);
}

/**
 * 格式化金额
 * @param {number} val
 * @param {string} [params.currency = ''] - 返回值的前缀
 * @param {number} [params.decimals = 0] - 保留小数位数
 * @param {boolean} [params.suffix = false] - 当val的小数撑不满decimals时补0
 * @return {number | string}
 */
export const currency = (val: string | number | undefined, params?: { currency?: string; decimals?: number; suffix?: boolean }) => {
  const { currency = '', decimals = 0, suffix = false } = params ?? {};
  if (val === undefined || isNaN(Number(val))) return val?.toString() ?? '';
  const digitsRE = /(\d{3})(?=\d)/g;
  val = parseFloat(val.toString());
  if (!isFinite(val) || (!val && val !== 0)) return '';
  const stringified = Math.abs(val).toFixed(decimals);
  const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = _int.length % 3;
  const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
  let _float = decimals ? stringified.slice(-1 - decimals) : '';
  const sign = val < 0 ? '-' : '';
  _float = _float && parseFloat(_float) ? parseFloat(_float).toString().substring(1) : '';
  if (suffix) {
    !_float.includes('.') && (_float = '.' + _float);
    _float = _float.padEnd(decimals + 1, '0');
  }
  return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
};

export function formatToPercentage(value = 0, { digits = 0, withUnit = true } = {}) {
  const percentage = (value * 100).toFixed(digits);
  return withUnit ? `${percentage}%` : percentage;
}

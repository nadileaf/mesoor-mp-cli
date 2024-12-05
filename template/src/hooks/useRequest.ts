import { ref, watch, onMounted, onUnmounted, isRef } from 'vue';
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import { delay, debounce, loadingModal } from '@/utils/common';
import { type DebounceSettings, isNil } from 'lodash-es';
import type { WatchSource, WatchStopHandle, Ref, ComputedRef } from 'vue';

export function useRequest<T, W>(
  request: () => Promise<T>,
  options?: {
    /** 依赖刷新 */
    refreshDeps?: Array<WatchSource>;
    /** 当开启showLoading时，最少请求时间,默认300ms */
    refreshDelay?: number;
    /** 一个依赖数据，如果数组中有值，当这些值不为 isNil 时才会进行 request */
    required?: Array<Ref<W> | ComputedRef<W> | W> | (() => any);
    /** 显示loading */
    showLoading?: boolean;
    /** onshow的时候刷新 */
    activatedRefresh?: boolean;
    /** 手动执行 */
    manual?: boolean;
    /** 成功后回调 */
    onSuccess?: (res: T) => void;
    /** 失败后回调 */
    onError?: (err: unknown) => void;
    /** 防抖选项 */
    debounceOptions?: number | ({ wait: number } & Partial<DebounceSettings>);
    /** 是否启用下拉刷新 */
    enablePullDownRefresh?: boolean;
  }
) {
  const error = ref();
  const loading = ref(false);
  const refreshDelay = options?.refreshDelay ?? 300;
  const response = ref<T>();

  const query = options?.debounceOptions
    ? typeof options.debounceOptions === 'number'
      ? debounce(_query, options.debounceOptions, { leading: true })
      : debounce(_query, options.debounceOptions.wait, {
          leading: true,
          ...options.debounceOptions
        })
    : _query;

  //延迟加载，不然在移动端转场动画还没结束就触发onShow了。
  if (options?.activatedRefresh) {
    onShow(() => {
      setTimeout(() => !options?.manual && query(), 0);
    });
  } else {
    !options?.manual && onMounted(() => query());
  }

  async function _query() {
    if (loading.value) return;
    if (options?.required) {
      const canQuery =
        typeof options?.required === 'function'
          ? Boolean(options?.required())
          : options.required.every((option) => {
              const res = unref(option);
              return typeof res === 'boolean' ? res : !isNil(res);
            });
      console.log('useRequest canQuery :>> ', canQuery);
      if (!canQuery) return;
    }
    try {
      loading.value = true;
      error.value = undefined;
      const startTime = Date.now();
      response.value = await request();
      // 防止系统loading太快消失闪烁
      if (options?.showLoading && Date.now() - startTime < refreshDelay) {
        await delay(refreshDelay - Date.now() + startTime);
      }
      options?.onSuccess?.(response.value);
    } catch (err) {
      console.error(err);
      error.value = err;
      options?.onError?.(err);
    } finally {
      options?.enablePullDownRefresh && uni.stopPullDownRefresh();
    }
    loading.value = false;
  }

  let stopWatch: WatchStopHandle;
  function watchRefreshDeps() {
    options?.refreshDeps?.length && (stopWatch = watch(options?.refreshDeps, query, { deep: true }));
  }

  options?.showLoading &&
    watch(loading, (val) => {
      val ? loadingModal.show() : loadingModal.hide();
    });

  onMounted(() => watchRefreshDeps());
  onUnmounted(() => {
    stopWatch && stopWatch();
  });

  options?.enablePullDownRefresh &&
    onPullDownRefresh(() => {
      console.log('useRequest onPullDownRefresh ===========>');
      query();
    });

  return { response, refresh: query as typeof _query, error, loading };
}

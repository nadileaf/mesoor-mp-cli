import { computed, reactive, ref, type WatchSource, type WatchStopHandle } from 'vue';
import { delay, debounce, loadingModal } from '@/utils/common';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { isNil, type DebounceSettings } from 'lodash-es';
import type { Ref } from 'vue';
import { projectService } from '@/services/project';
import { taskService } from '@/services/task';
import { entityService } from '@/services/entity';

export type UseListOptions<T, O = unknown, W = unknown> = {
  /** 依赖刷新 */
  refreshDeps?: Array<WatchSource>;
  /** 一个依赖数据，如果数组中有值，当这些值不为 isNil 时才会进行 request */
  required?: Array<Ref<W> | ComputedRef<W> | W> | (() => any);
  /** 显示loading */
  showLoading?: boolean;
  loadingOptions?: Parameters<typeof loadingModal.show>[0];
  /** 刷新延迟，防止loading太快闪烁 */
  refreshDelay?: number;
  manual?: boolean;
  onSuccess?: (res: { data: T[]; total: number } & O) => void;
  /** 是否监听页面下拉刷新，开启需要到pages.json,对应page的style enablePullDownRefresh:true  */
  enablePullDownRefresh?: boolean;
  debounceOptions?: number | ({ wait: number } & Partial<DebounceSettings>);
  pageSize?: number;
};

export type Pagination = Required<Omit<SearchModel.PaginationParams, 'total'>>;

export const useList = <T, O>(
  request: (pagination: Pagination) => Promise<{ data: T[]; total: number } & O>,
  options?: UseListOptions<T, O>
) => {
  const refreshDelay = options?.refreshDelay ?? 300;
  const list = ref<T[]>([]) as Ref<T[]>;
  const total = ref<number>(0);
  const pagination = reactive<Pagination>({
    current: 1,
    pageSize: options?.pageSize || 15
  });
  const loading = ref(false);
  const loadMoreStatus = computed(() => (loading.value ? 'loading' : list.value.length < total.value ? 'more' : 'noMore'));

  !options?.manual && refresh();

  async function query(refresh?: boolean) {
    if (loading.value) return;

    if (options?.required) {
      const canQuery =
        typeof options?.required === 'function'
          ? Boolean(options?.required())
          : options.required.every((option) => {
              const res = unref(option);
              return typeof res === 'boolean' ? res : !isNil(res);
            });
      console.log('useList canQuery :>> ', canQuery);
      if (!canQuery) return;
    }

    pagination.current = refresh ? 1 : pagination.current + 1;

    const startTime = Date.now();
    loading.value = true;

    try {
      const result = await request(pagination);
      if (Date.now() - startTime < refreshDelay) {
        await delay(refreshDelay - Date.now() + startTime);
      }
      list.value = refresh ? result.data : list.value.concat(result.data);
      total.value = result.total;
      options?.onSuccess?.(result);
    } catch (error) {
      console.error(error);
    } finally {
      options?.enablePullDownRefresh && uni.stopPullDownRefresh();
    }
    loading.value = false;
  }

  /** 刷新 */
  function refresh() {
    console.log('refresh');
    // list.value = [];
    const _query = () => query(true);

    if (!options?.debounceOptions) return _query();

    const debouncedQuery =
      typeof options.debounceOptions === 'number'
        ? debounce(_query, options.debounceOptions, { leading: true })
        : debounce(_query, options.debounceOptions.wait, {
            leading: true,
            ...options.debounceOptions
          });

    return debouncedQuery();
  }

  /** 加载更多 */
  function loadMore() {
    if (loadMoreStatus.value === 'noMore') return;
    query();
  }

  let stopWatch: WatchStopHandle;
  function watchRefreshDeps() {
    options?.refreshDeps?.length && (stopWatch = watch(options?.refreshDeps, refresh, { deep: true }));
  }

  watchRefreshDeps();
  onUnmounted(() => {
    stopWatch && stopWatch();
  });

  const showLoading = options?.showLoading ?? true;
  showLoading && watch(loading, (val) => (val ? loadingModal.show(options?.loadingOptions) : loadingModal.hide()));

  options?.enablePullDownRefresh &&
    onPullDownRefresh(() => {
      console.log('useList onPullDownRefresh ===========>');
      refresh();
    });

  onReachBottom(() => {
    console.log('useList onReachBottom ===========>');
    loadMore();
  });

  return { list, total, loading, loadMoreStatus, refresh, loadMore };
};

type EntityListData<
  T extends EntityModel.EntityType = EntityModel.EntityType,
  P extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType
> = T extends 'Project'
  ? ProjectModel.Project<P>
  : T extends 'HydrogenTask'
  ? TaskModel.Task<P>
  : EntityModel.BusinessEntity<Exclude<T, EntityModel.BasicEntityType>>;

/** @description 基于useList的通用hook,用于首页和搜索查询不同实体 */
export const useEntityList = <T extends SearchModel.SearchEntityType = SearchModel.SearchEntityType>(
  params: ComputedRef<SearchModel.SearchEntityParams<T>> | Ref<SearchModel.SearchEntityParams<T>>,
  options?: UseListOptions<EntityListData, { filters?: SearchModel.FilterValue[] }>
) => {
  const { list, total, ...rest } = useList((pagination) => {
    const _params = { ...pagination, ...params.value };

    switch (_params.entityType) {
      case 'Project':
        return projectService.query(_params);
      case 'HydrogenTask':
        return taskService.query(_params);
      default:
        return entityService.query(_params);
    }
  }, options);

  // reset list when entityType changed
  watch(
    () => params.value.entityType,
    () => {
      list.value = [];
      total.value = 0;
    }
  );

  return { list, total, ...rest };
};

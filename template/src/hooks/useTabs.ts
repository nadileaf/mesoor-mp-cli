import type { Tab } from '@/components/basic/MTabs.vue';
import type { ComputedRef } from 'vue';

export function useTabs<V extends string | number = string, O extends Common.UnknownObj = Common.UnknownObj>(
  data: Array<Tab<V> & O> | ComputedRef<Array<Tab<V> & O>> | Ref<Array<Tab<V> & O>>,
  defaultIndex = 0
) {
  const tabs = ref<Array<Tab<V> & O>>([]);

  const currentTabValue = ref(tabs.value?.[0]?.value);

  watchEffect(() => {
    // Type 'Tab<V> & O' is not assignable to type 'UnwrapRefSimple<Tab<V> & O>'.ts(2322)
    tabs.value = (isRef(data) ? data.value : data) as any;
    console.log('tabs.value :>> ', tabs.value);
  });

  watch(
    tabs,
    (value) => {
      if (!value.length) return;
      currentTabValue.value = value[defaultIndex].value as any;
      console.log('currentTabValue :>> ', currentTabValue.value);
    },
    { immediate: true }
  );

  const currentTab = computed(() => tabs.value?.find((t) => t.value === currentTabValue.value) || tabs.value[defaultIndex]);

  return {
    tabs,
    currentTabValue,
    currentTab
  };
}

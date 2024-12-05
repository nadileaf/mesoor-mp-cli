import type { FilterOptionConfig } from '@/config/search/filter';
import { createConfigWithDefault, createDictionaryConfigItem } from '../default';

export const filterOptionConfig: FilterOptionConfig = createConfigWithDefault([
  {
    ...createDictionaryConfigItem('industry', 'data.standardFields.industries')
  },
  { label: '客户状态', key: 'data.standardFields.status', values: [] }
]);

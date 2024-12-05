import type { FilterOptionConfig } from '@/config/search/filter';
import { createConfigWithDefault } from '../default';

export function getKeyById(id: DictionaryModel.DictionaryId) {
  let key: keyof SystemEmployeeModel.ConcernInfo;
  switch (id) {
    case 'industry':
      key = 'industries';
      break;
    case 'category':
      key = 'categories';
      break;
  }
  return key;
}

export const filterOptionConfig: FilterOptionConfig = createConfigWithDefault([]);

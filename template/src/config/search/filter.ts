import type { RouterUrl } from '@/hooks/useRouter';

export type FilterOptionConfigValuesWithLabel = {
  value: SearchModel.FilterValueType;
  label?: string;
};
export type FilterOptionConfigValues = (SearchModel.FilterValueType | FilterOptionConfigValuesWithLabel)[];

export type FilterOptionMode = 'numberRange' | 'dateRange';
export type FilterOptionConfig = (Pick<SearchModel.FilterValue, 'key' | 'label' | 'multiple'> &
  Partial<{
    values: FilterOptionConfigValues;
    /** 更多页 */
    toMorePage: RouterUrl;
    dictionaryId: DictionaryModel.DictionaryId;
    unit: string;
    ratio: number;
    foldable: boolean;
    /** 其他类型 */
    mode: FilterOptionMode;
  }>)[];

import type { FilterOptionConfig } from '@/config/search/filter';
import { createConfigWithDefault, createDictionaryConfigItem } from '../default';
import { formatFilterNumberRange } from '@/utils/format';

export const filterOptionConfig: FilterOptionConfig = createConfigWithDefault([
  {
    label: '期望地',
    key: 'data.standardFields.locations.city',
    values: ['北京市', '上海市', '广州市', '深圳市'],
    toMorePage: '/packages/common/city'
  },
  {
    label: '学历',
    key: 'data.standardFields.degreeRequirements',
    values: []
  },
  {
    label: '薪资要求',
    key: 'data.standardFields.salaryRange.gt.amount.number,data.standardFields.salaryRange.lt.amount.number',
    values: [[0, 10], [10, 20], [20, 30], [30, 40], [40, 50], [50]].map(([minimum, maximum]) => ({
      value: {
        minimum: minimum ? minimum * 1000 : minimum,
        maximum: maximum ? maximum * 1000 : maximum
      },
      label: formatFilterNumberRange({ minimum, maximum }, 'k')
    })),
    multiple: false
  },
  {
    label: '工作经验',
    key: 'data.standardFields.workExperienceRequirement.gt,data.standardFields.workExperienceRequirement.lt',
    values: [
      { value: { minimum: 1, maximum: 3 } },
      { value: { minimum: 3, maximum: 5 } },
      { value: { minimum: 5, maximum: 10 } },
      { value: { minimum: 10 } }
    ],
    unit: '年'
  },
  {
    ...createDictionaryConfigItem('industry', 'data.standardFields.industries')
  },
  {
    label: '来源',
    key: 'data.standardFields.source',
    values: [],
    multiple: true
  }
]);

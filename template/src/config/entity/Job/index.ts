import type { FilterOptionConfig } from '@/config/search/filter';
import { workTypeData, turnToFilterValues } from '@/services/dictionary';
import { formatFilterNumberRange } from '@/utils/format';

export const filterOptionConfig: FilterOptionConfig = [
  {
    label: '职位类型',
    key: 'data.standardFields.workTimeType',
    values: turnToFilterValues(workTypeData)
  },
  {
    label: '薪资要求',
    key: 'data.standardFields.salaryRange.gt.amount.number,schema.data.standardFields.salaryRange.lt.amount.number',
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
    label: '期望地',
    key: 'data.standardFields.locations.city',
    values: ['北京市', '上海市', '广州市', '深圳市'],
    toMorePage: '/packages/common/city'
  },
  {
    label: '经验要求',
    key: 'data.standardFields.workYearsRequirement.gt,data.standardFields.workYearsRequirement.lt',
    values: [
      { value: { minimum: 1, maximum: 3 } },
      { value: { minimum: 3, maximum: 5 } },
      { value: { minimum: 5, maximum: 10 } },
      { value: { minimum: 10 } }
    ],
    unit: '年'
  },
  {
    label: '行业职能',
    key: 'data.standardFields.categories',
    values: ['服务员', '促销员', '咖啡师'],
    toMorePage: '/packages/common/selector'
  }
];

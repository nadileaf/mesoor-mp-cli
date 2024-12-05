import { formatFilterNumberRange } from '@/utils/format';
import { createConfigWithDefault, createDictionaryConfigItem } from '../default';

export const EXPECTATION_JOBS_MAX_COUNT = 3;

export const EXPECTATION_JOBS_KEY = 'schema.data.standardFields.categories';
export const EXPECTATION_CITYS_KEY = 'schema.data.standardFields.locations.city';

export const filterOptionConfig = createConfigWithDefault([
  {
    label: '公司',
    key: 'data.standardFields.works.companyName',
    values: [],
    toMorePage: '/packages/common/selector'
  },
  {
    ...createDictionaryConfigItem('industry', 'data.standardFields.works.industryNames')
  },
  {
    ...createDictionaryConfigItem('category', 'data.standardFields.works.functionType')
  },
  {
    label: '年薪范围',
    key: 'data.standardFields.expectations.salaryRange.gt.amount.number,data.standardFields.expectations.salaryRange.lt.amount.number',
    values: [[0, 20], [20, 30], [30, 40], [40, 50], [50, 60], [60]].map(([minimum, maximum]) => ({
      value: {
        minimum: minimum ? minimum * 10000 : minimum,
        maximum: maximum ? maximum * 10000 : maximum
      },
      label: formatFilterNumberRange({ minimum, maximum }, '万')
    })),
    unit: '万',
    ratio: 10000,
    mode: 'numberRange'
  },
  {
    label: '城市',
    key: 'data.standardFields.expectations.locations.city',
    values: [],
    toMorePage: '/packages/common/city'
  },
  {
    label: '来源',
    key: 'data.standardFields.source',
    values: [],
    toMorePage: '/packages/common/selector'
  }

  // {
  //   label: '学历要求',
  //   key: 'data.standardFields.educations.degree.rank',
  //   values: [
  //     { value: { maximum: getDegreeRank('高中') }, label: '高中及以下' },
  //     { value: { minimum: getDegreeRank('专科') }, label: '大专及以上' },
  //     { value: { minimum: getDegreeRank('本科') }, label: '本科及以上' }
  //   ],
  //   multiple: false
  // },
  // { label: '人才类型', key: 'data.standardFields.expectations.workTypeNames', values: turnToFilterValues(workTypeData) },
  // {
  //   label: '经验要求',
  //   key: 'data.standardFields.humanInfo.workMonths',
  //   values: [
  //     { value: { maximum: 0 }, label: '在校生' },
  //     { value: { minimum: 1, maximum: 3 } },
  //     { value: { minimum: 3, maximum: 5 } },
  //     { value: { minimum: 5, maximum: 10 } },
  //     { value: { minimum: 10 } }
  //   ],
  //   unit: '年'
  // },
  // {
  //   label: '年龄',
  //   key: 'data.standardFields.humanInfo.age',
  //   values: [
  //     { value: { minimum: 16, maximum: 20 } },
  //     { value: { minimum: 20, maximum: 30 } },
  //     { value: { minimum: 30, maximum: 40 } },
  //     { value: { minimum: 40 } }
  //   ],
  //   unit: '岁'
  // },

  // { label: '性别', key: 'data.standardFields.humanInfo.genderName', values: turnToFilterValues(genderNameData), multiple: false },
  // {
  //   label: '行业职能',
  //   key: 'data.standardFields.expectations.jobNames',
  //   values: ['服务员', '促销员', '咖啡师'],
  //   toMorePage: '/packages/common/selector'
  // }
]);

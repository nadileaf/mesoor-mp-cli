/** @description 实体状态 */
export enum EntityStatus {
  /** 正常 */
  Normal = '0',
  /** 归档 */
  Archived = '1',
  /** 假数据 */
  Fake = '2'
}

export const JOB_STATUS_MAP = new Map<JobModel.HeadHunterStatus, Common.ComponentType>([
  ['进展中', 'primary'],
  ['成功的', 'success'],
  ['失败的', 'error'],
  ['已取消', 'warning'],
  ['暂停的', 'warning']
]);

export const BP_STATUS_MAP = new Map<string, Common.ComponentType>([
  ['无状态', 'default'],
  ['开发中', 'primary'],
  ['有意向', 'warning'],
  ['已签约', 'success'],
  ['已拒绝', 'error'],
  ['BD Leads', 'info']
]);

export const DictionaryTitleMap = new Map<DictionaryModel.DictionaryId, string>([
  ['industry', '行业'],
  ['category', '职能']
]);

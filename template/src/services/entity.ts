import { mesoorSpacePrefixUrl, request } from '@/services';
import { generateUrl } from '@/utils/common';
import { truthy } from '@/utils/types';
import type { RequestOptions } from '@/utils/request';

export type EntityQueryParams<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = SearchModel.SearchParams & {
  /** 要搜索的实体 */
  entityType: T;
  /** 不显示在筛选结果中的filters */
  innerFilters?: SearchModel.FilterValue[];
  /** 是否返回filters */
  returnFilters?: boolean;
  /** 过滤角色权限 */
  roleGenIds?: string[];
};
export type EntityQueryResponse<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = SearchModel.SearchResponse<
  EntityModel.BusinessEntity<T>
>;

export type EntityListRefreshParams<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = Pick<
  EntityQueryParams<T>,
  'entityType' | 'query' | 'filters' | 'innerFilters'
>;
export type EntityListLoadMoreParams<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = Pick<
  EntityQueryParams<T>,
  'current' | 'pageSize' | 'sort'
>;

export type EntityQueryDetailParams<T extends EntityModel.EntityType = EntityModel.BusinessEntityType> = {
  entityId: string | undefined;
  entityType: T;
};

export type FavoriteEntityParams = EntityQueryDetailParams;

export type FavoritesEntityParams = {
  context: {
    entityType: EntityModel.BusinessEntityType;
    openId: string;
  };
  target: {
    entityType: EntityModel.BusinessEntityType;
    openId: string;
  };
};

export type EntityUploadParams<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = {
  /** entityId不传则后端自动生成 */
  entityId?: string;
  entityType: T;
  /** 文件 */
  filePath: string;
  fileName?: string;
  /** 上传进度回调 */
  onUploadProgress?: (e: UniApp.OnProgressUpdateResult) => void;
};

export type EntityCreateParams<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = {
  entityType: T;
  openId?: string;
  schema?: string;
  data: EntityModel.BusinessEntity<T>['data'];
  associatedProjectConfig?: string;
};

export type RecommendParams = {
  entityType: Extract<EntityModel.BusinessEntityType, 'Job' | 'Resume'>;
  openId: string;
  geo?: Common.NormalizedField.GeoPoint;
} & Pick<SearchModel.SearchParams, 'filters' | 'current' | 'pageSize'>;

export type EntityLocationResponse<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = SearchModel.SearchResponse<{
  spaceId: string;
  spaceName?: string;
  channelId: string;
  channelName?: string;
  projectId: string;
  projectName?: string;
  project: ProjectModel.Project<T>;
  projectPayload?: EntityModel.BusinessEntityPayload<T>;
}>;

export type EntityApprovalCreateParams = {
  entityType: EntityModel.BusinessEntityType;
  data: EntityModel.BusinessEntity['data'];
};

export type EntityApprovalUpdateParams = {
  entityId: string;
  entityType: EntityModel.BusinessEntityType;
  data: Record<string, any>;
};

export const entityService = {
  async query<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>(
    params: EntityQueryParams<T>
  ): Promise<EntityQueryResponse<T>> {
    try {
      const {
        current = 1,
        pageSize = 15,
        query,
        filters: requestFilters = [],
        innerFilters = [],
        returnFilters = false,
        ...otherParams
      } = params;
      const filters = parseFilters([...requestFilters, ...innerFilters], 'search');
      if (!query && !otherParams.sort) otherParams.sort = 'meta.createdAt:desc';
      // cgl特殊逻辑，商机默认只显示薪资20k以上
      const salaryRangeKey = 'data.standardFields.salaryRange.lt.amount.number';
      if (params.entityType === 'JobOpportunities' && !filters.some((f) => f.key.includes(salaryRangeKey))) {
        filters.unshift({
          key: salaryRangeKey,
          values: [{ minimum: 20000 }]
        });
      }

      const result = await request.post<EntityQueryResponse<T>>(
        mesoorSpacePrefixUrl('/v3/entities/searches'),
        {
          ...otherParams,
          query,
          filters,
          returnFilters,
          current,
          pageSize
        },
        { handleResponseData: false, hideErrorMessage: true }
      );

      return {
        ...result,
        filters: parseFilters(result.filters || [], 'search')
      };
    } catch (error) {
      console.log(error);
      return { data: [], total: 0 };
    }
  },

  async queryFilters(entityType: EntityModel.BusinessEntityType) {
    const result = await request.post<SearchModel.FilterValue[]>(mesoorSpacePrefixUrl('/v3/entities/searches/filters'), { entityType });
    return result ? parseFilters(result, 'search') : [];
  },
  /** 查询字典 */
  async queryDictionary(id: DictionaryModel.DictionaryId) {
    return request.get<DictionaryModel.Dictionary>(mesoorSpacePrefixUrl(`/v2/entities/Dictionary/${id}`));
  },

  async queryDetail<T extends EntityModel.EntityType = EntityModel.BusinessEntityType>({
    entityId,
    entityType
  }: EntityQueryDetailParams<T>) {
    console.log(entityType, entityId);
    if (!entityId || !entityType) return Promise.reject();

    const header =
      entityType === 'ShortCode'
        ? {
            'Tenant-Id': import.meta.env.VITE_AUTH_TENANT_ID,
            'User-Id': 'mesoor-admin'
          }
        : undefined;

    return request.get<T extends EntityModel.BusinessEntityType ? EntityModel.BusinessEntity<T> : SchemaEntity.SchemaEntity>(
      mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityId)}`),
      undefined,
      { hideErrorMessage: true, header }
    );
  },

  async upload<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>({
    entityId,
    entityType,
    filePath,
    fileName,
    onUploadProgress
  }: EntityUploadParams<T>) {
    const apiUrl = generateUrl(mesoorSpacePrefixUrl(`/v2/entities/${entityType}/upload`), { openId: entityId });
    const result = await request.upload<EntityModel.BusinessEntity<T>>(apiUrl, {
      filePath,
      timeout: 90000,
      onUploadProgress,
      formData: { filename: fileName }
    });
    console.log('upload', result);
    return result;
  },

  /** @description 创建实体 */
  async create<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>({
    entityType,
    openId,
    schema,
    data,
    associatedProjectConfig
  }: EntityCreateParams<T>) {
    try {
      const apiUrl = generateUrl(mesoorSpacePrefixUrl(`/v2/entities/${entityType}`), { openId, schema, associatedProjectConfig });
      const result = await request.post<EntityModel.BusinessEntity<T>>(apiUrl, data);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async patchEntity(
    entityType: EntityModel.BusinessEntityType,
    params: {
      data?: Record<string, any>;
      openId?: string;
    },
    options?: Partial<RequestOptions>
  ) {
    if (!params.openId || !entityType) return Promise.reject();
    return request.patch(mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${params.openId}`), params.data, {
      ...options,
      header: {
        ['content-type']: `application/merge-patch-simple+json`
      }
    });
  },

  /** 获取短码 */
  async getShortCode(content: string) {
    if (!content) return Promise.reject();
    return request.get<string>(mesoorSpacePrefixUrl(`/v1/short-codes?content=${encodeURIComponent(content)}`));
  },

  /** 获取 entity 的所有位置 */
  queryEntityLocations<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>({
    entityId,
    entityType
  }: EntityQueryDetailParams) {
    if (!entityId || !entityType) return Promise.reject();
    return request.get<EntityLocationResponse<T>>(
      mesoorSpacePrefixUrl(`/v3/entities/${entityType}/${encodeURIComponent(entityId)}/projects`),
      {},
      { handleResponseData: false }
    );
  },

  /** @description 批量获取实体已经关联的task信息 */
  async queryAssociate({ entityType, entityIds }: { entityIds: string[]; entityType: EntityModel.BusinessEntityType }) {
    return request.get<Record<string, EntityModel.AssociatedInfo[]>>(mesoorSpacePrefixUrl(`/v3/entities/${entityType}/associate/tasks`), {
      entityType,
      openIds: entityIds[0]
    });
  },

  /** 获取实体评价 */
  queryEntityEvaluations({
    entityId,
    entityType,
    current = 1,
    pageSize = 10,
    self = false
  }: SearchModel.SearchParams<
    EntityQueryDetailParams & {
      /** 为 true 则只返回自己写的 */
      self?: boolean;
    }
  >) {
    return request.get<SearchModel.SearchResponse<EvaluationModel.Evaluation>>(
      mesoorSpacePrefixUrl(`/v1/entities/${entityType}/${entityId}/evaluation`),
      { current, pageSize, self },
      {
        handleResponseData: false,
        hideErrorMessage: true
      }
    );
  },
  /** 评价实体 */
  createEvaluationOnEntity({ entityId, entityType, ...evaluation }: EntityQueryDetailParams & EvaluationModel.BasicEvaluation) {
    return request.post<EvaluationModel.Evaluation>(mesoorSpacePrefixUrl(`/v1/entities/${entityType}/${entityId}/evaluation`), {
      ...evaluation
    });
  },
  /** 修改实体评价 */
  updateEntityEvaluation({
    entityId,
    entityType,
    evaluationId,
    ...evaluation
  }: { evaluationId: number } & EntityQueryDetailParams & EvaluationModel.BasicEvaluation) {
    return request.patch<EvaluationModel.Evaluation>(
      mesoorSpacePrefixUrl(`/v1/entities/${entityType}/${entityId}/evaluation/${evaluationId}`),
      {
        ...evaluation
      }
    );
  },
  /** 删除实体评价 */
  deleteEntityEvaluation({ entityId, entityType, evaluationId }: { evaluationId: number } & EntityQueryDetailParams) {
    return request.delete(mesoorSpacePrefixUrl(`/v1/entities/${entityType}/${entityId}/evaluation/${evaluationId}`));
  }
};

export const entityApprovalService = {
  create({ entityType, data }: EntityApprovalCreateParams) {
    return request.post<EntityModel.BusinessEntity>(mesoorSpacePrefixUrl(`/entity-approval/v3/entities/${entityType}`), data, {
      handleResponseData: false
    });
  },

  update({ entityId, entityType, data }: EntityApprovalUpdateParams) {
    return request.patch<EntityModel.BusinessEntity>(mesoorSpacePrefixUrl(`/entity-approval/v3/entities/${entityType}/${entityId}`), data, {
      handleResponseData: false,
      header: {
        ['content-type']: 'application/merge-patch+json'
      }
    });
  }
};

function parseFilters(filters: SearchModel.FilterValue[], mode: 'search' | 'recommend') {
  const res = filters;
  for (const f of filters) {
    if (f.key === 'all') continue;
    if (mode === 'recommend' && !f.key.startsWith('schema')) {
      f.key = `schema.${f.key}`;
    }

    f.values = f.values.map((v) => (typeof v === 'object' && 'value' in v ? (v.value as string) : v)).filter(truthy);
  }

  return res;
}

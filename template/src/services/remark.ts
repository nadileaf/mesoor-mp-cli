import { mesoorSpacePrefixUrl, request } from '.';

type RemarkCommonParams = {
  entityId: string;
  entityType: EntityModel.EntityType;
};

type RemarkQueryParams = SearchModel.SearchParams<RemarkCommonParams & { myself?: boolean }>;
type RemarkQueryResponse = SearchModel.SearchResponse<EntityRemarkModel.Remark>;

/** @description 实体备注服务 */
export const entityRemarkService = {
  query({ entityId, entityType, pageSize = 100, ...rest }: RemarkQueryParams) {
    return request.get<RemarkQueryResponse>(
      mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityId)}/remarks`),
      { pageSize, ...rest },
      { handleResponseData: false }
    );
  },

  create({ entityId, entityType, ...rest }: RemarkCommonParams & { content: string }) {
    return request.post<EntityRemarkModel.Remark>(
      mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityId)}/remarks`),
      rest
    );
  },

  delete({ entityId, entityType, remarkId, ...rest }: RemarkCommonParams & { remarkId: string }) {
    return request.delete(mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityId)}/remarks/${remarkId}`), rest);
  }
};

import { request, mesoorSpacePrefixUrl } from '.';

type RecommendParams<T extends EntityModel.BusinessEntityType> = SearchModel.SearchParams & {
  contextEntityType: EntityModel.BusinessEntityType;
  contextOpenIds: string[];
  targetEntityType: T;
};

/** 智能推荐 https://mesoor-space-recommend.nadileaf.com/docs/#/%E6%99%BA%E8%83%BD%E6%8E%A8%E8%8D%90V3/postV3Recommendations */
export const recommendV3Service = {
  async query<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>(params: RecommendParams<T>) {
    return request.post<SearchModel.SearchResponse<EntityModel.Entity<T>>>(mesoorSpacePrefixUrl(`/v3/recommendations`), params, {
      handleResponseData: false
    });
  },

  async ruleMatching<T extends EntityModel.BusinessEntityType>(params: RecommendParams<T>) {
    return request.post<SearchModel.SearchResponse<EntityModel.Entity<T>>>(mesoorSpacePrefixUrl(`/v1/rule-matching`), params, {
      handleResponseData: false
    });
  }
};

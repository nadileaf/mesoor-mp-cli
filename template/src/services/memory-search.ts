import { mesoorSpacePrefixUrl, request } from '.';

type MemorySearchEntityType = 'Project' | 'HydrogenTask';

type QueryMemorySearchParams<T extends MemorySearchEntityType> = SearchModel.BasicSearchParams & {
  entityType: T;
  config?: string;
};

type Map<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = {
  Project: ProjectModel.Project<T>;
  HydrogenTask: TaskModel.Task<T>;
};

type QueryMemorySearchResponse<
  T extends MemorySearchEntityType,
  P extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType
> = SearchModel.SearchResponse<Map<P>[T]>;

export const memorySearchService = {
  query<T extends MemorySearchEntityType, P extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>(
    params: QueryMemorySearchParams<T>
  ) {
    return request.post<QueryMemorySearchResponse<T, P>>(
      mesoorSpacePrefixUrl('/v2/memory-searches'),
      { ...params, compact: true },
      { handleResponseData: false }
    );
  }
};

import { mesoorSpacePrefixUrl, request } from '.';

export type CreateTagLibraryParams = Pick<TagModel.TagLibrary, 'name' | 'style'> & Partial<Pick<TagModel.TagLibrary, 'editable' | 'type'>>;
export type EditTagLibraryParams = {
  id: string;
} & Partial<CreateTagLibraryParams>;
export type QueryTagLibraryParams = SearchModel.SearchParams<{
  name?: string;
  type?: EntityModel.EntityType;
}>;
export type QueryTagLibraryResponse = SearchModel.SearchResponse<TagModel.TagLibrary>;

export const tagLibraryService = {
  /** @description 获取标签分页列表 */
  async query(params: QueryTagLibraryParams) {
    return request.get<QueryTagLibraryResponse>(mesoorSpacePrefixUrl('/v2/tag-libraries'), params, { handleResponseData: false });
  },
  /** @description 创建标签 */
  async create(params: CreateTagLibraryParams) {
    return request.post<TagModel.TagLibrary>(mesoorSpacePrefixUrl('/v2/tag-libraries'), params);
  },
  /** @description 编辑标签 */
  async update(params: EditTagLibraryParams) {
    return request.put<TagModel.TagLibrary>(mesoorSpacePrefixUrl(`/v2/tag-libraries/${params.id}`), params);
  },
  /** @description 删除标签 */
  async delete(id: string) {
    return request.delete<null>(mesoorSpacePrefixUrl(`/v2/tag-libraries/${id}`));
  }
};

type EntityTagsQueryParams = {
  entityId: string;
  entityType: EntityModel.EntityType;
};
type EntityTagsCreateParams = {
  entityIds: string[];
  entityType: EntityModel.EntityType;
  tagLibraryIds: string[];
};
type EntityTagsDeleteParams = {
  entityId: string;
  tagLibraryId: string;
  entityType: EntityModel.EntityType;
};

export const entityTagsService = {
  /**  @description 获取实体标签 */
  async query({ entityId, entityType }: EntityTagsQueryParams) {
    if (!entityId || !entityType) return Promise.reject();
    return request.get<TagModel.EntityTag[] | undefined>(
      mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityId)}/tags`)
    );
  },

  /**  @description 添加实体标签 */
  async create({ entityIds, entityType, ...rest }: EntityTagsCreateParams) {
    if (!entityIds.length) return Promise.reject();
    entityIds.length === 1
      ? await request.post(mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityIds[0])}/tags`), {
          ...rest
        })
      : await request.post(mesoorSpacePrefixUrl(`/v2/entities/${entityType}/tags/batch`), { openIds: entityIds, ...rest });
  },

  /**  @description 删除实体标签 */
  async delete({ entityId, entityType, tagLibraryId }: EntityTagsDeleteParams) {
    await request.delete(mesoorSpacePrefixUrl(`/v2/entities/${entityType}/${encodeURIComponent(entityId)}/tags/${tagLibraryId}`));
  }
};

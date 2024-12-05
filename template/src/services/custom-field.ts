import { transformSchema } from '@/models/schema';
import { mesoorSpacePrefixUrl, request } from '.';

export const customFieldsService = {
  // 获取实体的schema
  async query(entityType: EntityModel.EntityType, entityId: string) {
    try {
      const url = mesoorSpacePrefixUrl(`/v3/entities/${entityType}/${entityId}/custom-fields`);
      const res = await request.get<SchemaModel.Schema & { properties?: Record<string, SchemaModel.Schema> }>(url, {
        isolation: true,
        format: 'raw'
      });
      transformSchema(res);
      return res;
    } catch (error) {
      console.error(error);
    }
  },
  /** @description 更新实体自定义字段 */
  async updateEntityCustomFields(params: { entityId: string; entityType: EntityModel.EntityType; data: Common.AnyFields | undefined }) {
    const url = mesoorSpacePrefixUrl(`/v2/entities/${params.entityType}?openId=${params.entityId}&customFields=true`);
    return request.put(url, { customFields: params.data });
  }
};

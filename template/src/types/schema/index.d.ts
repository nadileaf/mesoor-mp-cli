declare namespace SchemaEntity {
  /** @description 通用的meta信息 */
  type Meta = {
    openId: string;
    /** 创建时间 */
    createdAt?: Common.DateType;
    /** 创建人Id */
    createdBy?: string;
    /** 更新时间 */
    updatedAt?: Common.DateType;
    /** 更新人Id */
    updatedBy?: string;
    standardSchema?: string;
    customSchema?: string;
    source?: string;
    status?: import('@/models/entity').EntityStatus;
    [k: string]: any;
  };

  type BasicStandardFields = Partial<{
    name: string;
    description: string;
    tags: Common.NormalizedField.EntityTag[];
  }>;

  type BasicCustomFields = Partial<{
    /** 收藏 */
    userFavorite?: string[];
    favorites?: {
      openId: string;
      entityType: EntityModel.BusinessEntityType;
    }[];
    detectedSourceUrl?: string;
  }>;

  type RawData = {
    files?: Common.NormalizedField.File[];
    /** 半结构化数据（通过连接器导入，来自上游系统） */
    externalContent?: AnyFields;
  };

  type AnyFields = Record<string, any>;

  /** @description 基于Schema的entity  */
  type SchemaEntity<S = AnyFields, C = AnyFields, R = AnyFields, M = AnyFields> = {
    meta: Meta;
    data: {
      customFields?: BasicCustomFields & C;
      standardFields: BasicStandardFields & S;
      rawData?: RawData & R;
      /* FunctionFields TODO: 知识图谱*/
      functionFields?: AnyFields;
      managedFields?: {
        /** TODO 等级信息 */
        level?: unknown;
        /** 评价信息 */
        evaluationInfo?: EvaluationInfo;
        /** 相关实体 */
        entityRelated?: EntityRelated;
      } & M;
      extraData?: {
        score?: number;
        ratings?: RatingPerspective[];
        recommendReason: string;
        jobCount?: number;
        distance: string;
        description: string;
        priority: Common.Priority;
        startTime?: Common.DateType;
        timeoutTime?: Common.DateType;
      };
    };
  };

  type EntityRelated = Partial<
    Record<
      EntityModel.EntityType,
      {
        openId: string;
        entityType: EntityModel.EntityType;
        [k?: string]: string | number | boolean | undefined;
      }[]
    >
  >;

  type EvaluationInfo = {
    /** 平均分 */
    averageRating?: number;
    /** 评价累计总分 */
    cumulativeRatingScore?: number;
    /** 评价总数 */
    totalEvaluationCount?: number;
    /** 差评率 */
    negativeEvaluationRate?: number;
    /** 好评率 */
    positiveEvaluationRate?: number;
    /** 差评数量 */
    negativeEvaluationCount?: number;
    /** 好评数量 */
    positiveEvaluationCount?: number;
  };

  type FunctionFields = {
    /** 知识图谱 */
    educations?: KGModel.Education[];
    works?: KGModel.Business[];
    interns?: KGModel.Business[];
  };

  type RatingPerspective = {
    description: string;
    title: string;
    rating: Common.NormalizedField.Rating;
    comments: { text: string; aspect: string }[];
  };
}

declare namespace SchemaModel {
  type Schema = {
    $id?: string;
    $advanced_type?: SchemaFieldType;
    type: 'object' | 'array' | 'string' | 'integer' | 'number' | 'boolean'; // 基础类型
    const?: EntityModel.EntityType;
    web_type?: SchemaFieldType; // schema类型
    json_path: string;
    description: string; // 描述
    items?: Schema;
    enum?: string[];
    properties?: Record<string, Schema>;
    /** 供自定义字段存放类型使用 */
    name: SchemaFieldType;
    names?: Record<string, string>;
    default?: string;
    options?: {
      readonly?: boolean;
      formilySchema?: FormilySchema;
      /** 字段id,配合Select使用，调用mesoor space获取dataSource */
      dictionaryId?: string;
      [x: string]: any;
    };
    nullable?: boolean;
    title?: string;
    order?: number;
    minLength?: number;
    maxLength?: number;
    minimal?: number;
    maximal?: number;
  };

  type SchemaFieldType =
    | 'Date'
    | 'DateRange'
    | 'Email'
    | 'EntityReference'
    | 'File'
    | 'IntRange'
    | 'Location'
    | 'LongText'
    | 'MultiChoice'
    | 'Number'
    | 'NumberArray'
    | 'Percent'
    | 'PhoneNumber'
    | 'Progress'
    | 'Rating'
    | 'Select'
    | 'ShortText'
    | 'SingleChoice'
    | 'StringArray'
    | 'Website';

  type SchemaFields = Record<string, unknown>;
}

declare namespace EvaluationModel {
  type Evaluation = {
    id: number;
    rating: number;
    content?: string;
    tenantId: string;
    entityType: EntityModel.BusinessEntityType;
    openId: string;
    entity_owner: string;
    status: number;
    ext: unknown;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
  };

  type BasicEvaluation = Pick<Evaluation, 'rating' | 'content'>;
}

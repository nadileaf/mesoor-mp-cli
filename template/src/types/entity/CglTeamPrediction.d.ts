declare namespace CglTeamPredictionModel {
  type CglTeamPrediction = SchemaEntity.SchemaEntity<StandardFields>;

  type StandardFields = {
    team?: Common.NormalizedField.EntityReference;
    /**
     * 年
     */
    year?: number;
    /**
     * 月
     */
    month?: number;
    /**
     * 描述
     */
    description?: string;
    /**
     * 预计开票
     */
    expectedInvoice?: number;
    /**
     * 预计回款
     */
    expectedReceivable?: number;
  };
}

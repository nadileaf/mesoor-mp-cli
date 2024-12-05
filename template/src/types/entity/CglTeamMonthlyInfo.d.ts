declare namespace CglTeamMonthlyInfoModel {
  type CglTeamMonthlyInfo = SchemaEntity.SchemaEntity<StandardFields>;

  type StandardFields = {
    team?: Common.NormalizedField.EntityReference;
    /**
     * 状态
     */
    status?: string;
    /**
     * 公司
     */
    company?: string;
    sourceDate?: Common.NormalizedField.Date;
    /**
     * 当前成本
     */
    currentCost?: number;
    /**
     * 利润额
     */
    profitAmount?: number;
    /**
     * 预估评级
     */
    projectedRating?: string;
    /**
     * 回款金额
     */
    repaymentAmount?: number;
    /**
     * 预付款
     */
    prepaymentAmount?: number;
    /**
     * 累计到款利润额
     */
    accumulatedProfitAmount?: number;
    /**
     * 预计开票金额
     */
    estimatedInvoicingAmount?: number;
    /**
     * 预计回款金额
     */
    estimatedRepaymentAmount?: number;
    /**
     * 预估评级
     */
    projectedRating: string;
  };
}

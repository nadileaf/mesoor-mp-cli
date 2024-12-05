declare namespace InvoiceModel {
  type Invoice = SchemaEntity.SchemaEntity<StandardFields>;

  type FeeType = '人才推荐费' | '预付款' | '咨询服务费' | '其他服务费';
  type InvoiceType = '普通发票' | '虚拟发票' | 'Replacement' | 'Turndown Offer' | '红冲发票';
  type InstallmentsNumbers = '第一期收费' | '第二期收费' | '第三期收费';

  type Fee = {
    /** 收费类型 */
    feeType?: FeeType;
    chargeAmount?: Common.NormalizedField.Currency;
  };

  type PerformanceDistribution = {
    percentage?: Common.NormalizedField.Percent;
    tenantMember?: Common.NormalizedField.EntityReference;
    /** 业绩 */
    performanceAmount?: number;
  }[];

  type StandardFields = {
    /**
     * 收费信息
     */
    feeInformation?: {
      /**
       * 收费
       */
      fees?: Fee[];
      /**
       * 收费备注
       */
      feeRemark?: string;
      /**
       * 发票类型
       */
      invoiceType?: InvoiceType;
      dateOfInvoice?: Common.NormalizedField.Date;
      /**
       * 发票金额（税后）
       */
      invoiceAmount?: number;
      /**
       * 分期付款
       */
      payByInstallments?: boolean;
      expectedInvoiceDate?: Common.NormalizedField.Date;
      /**
       * 分期付款期数
       */
      installmentsNumbers?: InstallmentsNumbers;
      candidateMaxSalaryTotal?: Common.NormalizedField.Currency;
      candidateHistorySalaryTotal?: Common.NormalizedField.Currency;
    };
    originalInvoice?: Common.NormalizedField.File;
    /**
     * 项目信息
     */
    projectInformation?: {
      client?: Common.NormalizedField.EntityReference<BusinessPartnerModel.StandardFields>;
      candidate?: Common.NormalizedField.EntityReference<ResumeModel.StandardFields>;
      /** TenantMember */
      followUpPerson?: Common.NormalizedField.EntityReference;
    };
    /**
     * 业绩分配
     */
    performanceDistribution?: PerformanceDistribution;
  };
}

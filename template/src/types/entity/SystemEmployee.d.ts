declare namespace SystemEmployeeModel {
  type SystemEmployee = SchemaEntity.SchemaEntity<StandardFields, undefined, undefined, ManagedFields>;

  type StandardFields = ResumeModel.StandardFields & {
    employeeInfo?: EmployeeInfo;
    preferences?: {
      cities?: string[];
      industries?: string[];
      categories?: string[];
    };
  };

  type EmployeeInfo = Partial<{
    /** 入职日期 */
    hireDate: string;
    /** 关注的信息 */
    concernInfo: ConcernInfo;
    /** 当前的职位信息 */
    currentPosition: CurrentPosition;
    teamId: string;
  }>;

  type ConcernInfo = Partial<{
    /** 行业 */
    industries: string[];
    /** 职能 */
    categories: string[];
  }>;

  type CurrentPosition = Partial<{
    /** 职位名字 */
    jobName: string;
    /** 团队名字 */
    teamName: string;
    /** 公司名字 */
    companyName?: string;
    /** 状态 */
    status: Status;
  }>;

  type Invoicing = {
    /** 团队平均开票率 */
    invoicingRateAvg: number;
    /** 个人开票率 */
    personalPerformancePercentage: number;
    /** 个人业绩 */
    performance: number;
    updatedAt: Common.DateType;
  };

  type ManagedFields = {
    invoicing: Invoicing;
    cglTeamMonthlyInfo: CglTeamMonthlyInfoModel.StandardFields;
  };

  /** CGL */
  type Status = 'Active' | 'Inactive' | 'Leave' | undefined;
}

declare namespace PosterModel {
  type Poster = SchemaEntity.SchemaEntity<StandardFields>;

  type Job = Partial<{
    /**
     * 职位名称
     */
    name: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 发布招聘的公司
     */
    company?: string;
    /**
     * 职位关键词列表
     */
    keywords?: string[];
    /**
     * 工作地点
     */
    locations?: Common.NormalizedField.Location[];
    /**
     * 薪资
     */
    salary: string;
    /**
     * 任职资格描述
     */
    qualification?: string;
    /**
     * 工作职责描述
     */
    responsibility?: string;
    /**
     * 是否海外
     */
    isOversea?: boolean;
  }>;

  type StandardFields = {
    projectId: string;
    reference: Common.NormalizedField.EntityReference;
    Job?: Job;
  };
}

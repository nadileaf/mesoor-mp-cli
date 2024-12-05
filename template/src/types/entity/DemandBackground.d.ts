declare namespace DemandBackgroundModel {
  type DemandBackground = SchemaEntity.SchemaEntity<StandardFields>;

  type StandardFields = {
    reference?: Common.NormalizedField.EntityReference;
    content?: string;
    locations?: Common.NormalizedField.Location[];
    reference?: Common.NormalizedField.EntityReference;
    industryRequirements?: string[];
    degreeRequirement?: Common.NormalizedField.Degree[];
    productTechFields?: ProductTechField[];
    workYearsRequirement?: Common.NormalizedField.IntRange;
    benchmarkingCompanies?: string[];
    jobRequirementsLabel?: string[];
    keywords?: string[];
  };

  type ProductTechField = Partial<{
    field: string;
    description: string;
  }>;
}

declare namespace AIAppModel {
  type AIApp = SchemaEntity.SchemaEntity<StandardFields>;

  type StandardFields = {
    name: string;
    mode: string;
    icon: any;
    description: string;
    iconColor?: string;
    iconBackgroundColor: string;
    link: string;
    appliedTenants?: Common.NormalizedField.EntityReference[];
    value?: string;
  };
}

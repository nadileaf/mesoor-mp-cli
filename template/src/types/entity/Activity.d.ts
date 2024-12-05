declare namespace ActivityModel {
  type StandardFields = Partial<{
    /** 活动时间 */
    dateOfEvent: string;
    /** 活动举办方 */
    organizerOfTheEvent: string;
    /** 活动海报 */
    campaignPoster: Common.NormalizedField.File[];
  }>;

  type Activity = SchemaEntity.SchemaEntity<StandardFields>;
}

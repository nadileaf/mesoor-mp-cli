declare namespace Notices {
  type NoticeAction = 'StageUpdated' | 'ProjectCreated' | 'BusinessPartnerCreated';

  type Notice = {
    id: number;
    tenantId: string;
    userId: string;
    entityType: EntityModel.EntityType;
    openId: string;
    type: string;
    title: string;
    content: string;
    action: NoticeAction;
    event: string;
    status: number;
    createdBy: string;
    createdAt: Common.DateType;
    updatedAt: Common.DateType;
  };
}

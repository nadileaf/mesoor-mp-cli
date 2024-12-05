import { message } from '@/utils/common';
import { mesoorSpacePrefixUrl, request } from '.';
import { SORT_BY_UPDATED_DESC } from '@/config/search';

export enum TaskType {
  /** 招聘 */
  'RECRUIT' = 'recruit',
  /** 背调 */
  'BACKGROUND_CHECK' = 'backgroundChecks',
  /** 评测 */
  'ASSESSMENT' = 'assessments'
}

export enum RecruitTaskStage {
  'NEW' = '新消息',
  'NEXT' = '沟通过',
  'IGNORE' = '不感兴趣'
}

export enum JobStage {
  'ACTIVE' = '招聘中',
  'REVIEW' = '审核中',
  'FAILED' = '未过审',
  'DRAFT' = '草稿',
  'CLOSED' = '已关闭'
}

export enum BackgroundCheckStage {
  'TODO' = '待发起',
  'PROCESSING' = '背调中',
  'DONE' = '已出报告',
  'CANCEL' = '已终止'
}

export enum AssessmentStage {
  'TODO' = '待发起',
  'PROCESSING' = '测评中',
  'DONE' = '已出报告',
  'CANCEL' = '已终止'
}

export type CglTeamPredictionStage = '已填报' | '未填报';

export type ViewGroupBy = 'flow' | 'principal' | 'time' | 'tag';
type ViewOrdering = 'asc' | 'desc';
type ViewSearchHierarchyType = 'channel' | 'project' | 'flow';

export type QueryTasksRes<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType> = {
  data: TaskModel.Task<T>[];
  total: number;
};

export type CreateRecruitTaskParams = {
  jobId: string;
  recruiterUserId: string;
  resumeId: string;
  candidateUserId: string;
};

export type GroupData = {
  name: string;
  count: number;
  id: string;
  ordered: number;
  color?: string;
  parent?: string;
  parentName?: string;
  subGroups?: GroupData[];
} & (
  | { type: 'flow'; extra?: ChannelFlowModel.FlowStage }
  // | { type: 'principal'; extra?: UserModel.User }
  | { type: 'time'; extra?: unknown }
  | { type: 'tag'; extra?: unknown }
);

export type BoardViewGroups = GroupData[];

export type View = 'board' | 'list';

export type QueryTasksParams = Partial<
  SearchModel.SearchParams<{
    viewHistory: boolean;
    projectId: string;
    groupBy: ViewGroupBy;
    /** board 视图需要 */
    groupId: string;
    keyWords: string;
    searchRanges: string[];
    sortBy: string;
    ordering: ViewOrdering;
    /** 筛选条件，如负责人 */
    filters: SearchModel.FilterValue[];
    op?: 'and' | 'or';
    /** 搜索的层级 */
    searchHierarchyType: ViewSearchHierarchyType;
    skip: number;
    limit: number;
    view: View;
  }>
>;

export type TaskCreateParams = {
  projectId: string;
  stageId?: string;
  stageName?: string;
  taskPayloadOpenId: string;
  tagLibraryIds?: string[];
};

export type TaskModifyParams = {
  taskId: string;
  priority?: Common.Priority;
  startTime?: Common.DateType;
  timeoutTime?: Common.DateType;
  assignId?: string;
  stageId?: string;
};

export const taskService = {
  async query<T extends EntityModel.BusinessEntityType = EntityModel.BusinessEntityType>(params: QueryTasksParams) {
    const { groupBy = 'flow', searchRanges = [], sortBy = SORT_BY_UPDATED_DESC, current = 1, pageSize = 15, ...others } = params;

    try {
      const url = `/v2/memory-searches/tasks?view=${params.view ?? 'list'}`;
      const result = await request.post<QueryTasksRes<T>>(
        mesoorSpacePrefixUrl(url),
        { ...others, groupBy, searchRanges, sortBy, current, pageSize },
        { handleResponseData: false, hideErrorMessage: true }
      );
      return result;
    } catch (error) {
      return { data: [], total: 0 } as QueryTasksRes<T>;
    }
  },

  async queryGroups(params: QueryTasksParams) {
    const { groupBy = 'flow', searchRanges = [], sortBy = SORT_BY_UPDATED_DESC, current = 1, pageSize = 15, ...others } = params;

    const groups = await request.post<BoardViewGroups>(
      mesoorSpacePrefixUrl(`/v2/memory-searches/tasks/groups?view=board`),
      {
        ...others,
        groupBy,
        searchRanges,
        sortBy,
        current,
        pageSize
      },
      { hideErrorMessage: true }
    );

    return groups;
  },

  async queryDetail<T extends EntityModel.BusinessEntityType>(taskId: string) {
    if (!taskId) return Promise.reject();
    return request.get<TaskModel.Task<T>>(mesoorSpacePrefixUrl(`/v3/tasks/${taskId}`));
  },

  async createRecruit(params: CreateRecruitTaskParams & { stageName?: string }) {
    try {
      const result = await request.post<SchemaEntity.SchemaEntity>(
        mesoorSpacePrefixUrl(`/wanda/v3/tasks`),
        {
          stageName: params.stageName || RecruitTaskStage.NEW,
          taskPayloadType: 'Resume',
          taskPayloadOpenId: params.resumeId,
          projectPayloadType: 'Job',
          projectPayloadOpenId: params.jobId,
          customFields: {
            recruiterUserId: params.recruiterUserId,
            candidateUserId: params.candidateUserId,
            jobId: params.jobId,
            resumeId: params.resumeId
          }
        },
        { hideErrorMessage: true }
      );
      return {
        taskId: result?.meta.openId,
        projectId: result.data.standardFields.project.openId
      };
    } catch (error: any) {
      if (error?.statusCode === 409) return undefined;
      else {
        message.error(error?.data.message ?? '操作异常');
        return Promise.reject(error);
      }
    }
  },

  updateFlow(params: {
    taskIds: string[];
    stageName: RecruitTaskStage | JobStage | BackgroundCheckStage | AssessmentStage | CglTeamPredictionStage;
    /** 供 im 用 */
    tenantId?: string;
  }) {
    return request.put(
      mesoorSpacePrefixUrl(`/v3/tasks/stages`),
      params.taskIds.map((id) => ({ id, stageName: params.stageName })),
      {
        handleResponseData: false,
        header: params.tenantId ? { 'Tenant-Id': params.tenantId } : {}
      }
    );
  },

  // 创建流程
  async create(params: TaskCreateParams) {
    const result = await request.post<TaskModel.Task>(mesoorSpacePrefixUrl(`/v3/tasks`), params);
    return result;
  },

  async updateTask({ taskId, ...rest }: TaskModifyParams) {
    await request.put(mesoorSpacePrefixUrl(`/v3/tasks/${taskId}`), rest);
    return taskService.queryDetail(taskId);
  },

  async updateFlowStage({ stageId, taskId }: { stageId: string; taskId: string }) {
    await request.put(mesoorSpacePrefixUrl(`/v3/tasks/${taskId}/stages`), {
      stageId
    });
    return taskService.queryDetail(taskId);
  }
};

import { request, mesoorSpacePrefixUrl } from '.';
export type QueryEmployeeStatisticsParams = {
  entityId: string;
  startTime: Common.DateType;
  endTime: Common.DateType;
};

export type EmployeeStatisticType = 'Client' | 'Project' | 'RecommendCandidate' | 'InterviewCandidate';

export type EmployeeStatistic = {
  type: EmployeeStatisticType;
  title: string;
  startTime: Common.DateType;
  endTime: Common.DateType;
  count: number;
};

export type QueryEmployeeStatisticsResponse = SearchModel.SearchResponse<EmployeeStatistic>;

export const employeeStatisticsService = {
  query({ entityId, ...params }: QueryEmployeeStatisticsParams) {
    return request.get<QueryEmployeeStatisticsResponse>(
      mesoorSpacePrefixUrl(`/cgl/v1/employees/${entityId}/statistics`),
      { ...params },
      { handleResponseData: false }
    );
  }
};

import request from '@/utils/request';
import { mesoorSpacePrefixUrl } from '.';

type GetNoticesParams = SearchModel.SearchParams<{
  userId: string;
}>;

export const noticeService = {
  getNotices({ userId, current = 1, pageSize = 10 }: GetNoticesParams) {
    return request.get<SearchModel.SearchResponse<Notices.Notice>>(
      mesoorSpacePrefixUrl(`/v1/users/${userId}/notices?current=${current}&pageSize=${pageSize}`),
      {},
      { handleResponseData: false }
    );
  }
};

import { formatFileUrl } from '@/utils/format';
import { mesoorSpacePrefixUrl, request } from '.';
import { type QueryTasksRes } from './task';

export type Banner = { name: string; url: string; seats: string };

const defaultBanner: Banner[] = [
  {
    url: 'https://cdn-fe.mesoor.com/custom/wanda/assets/banner/default.jpg',
    name: '默认',
    seats: '1'
  }
];

interface QueryBannerParams {
  projectName?: string;
}

export const bannerService = {
  async query(params?: QueryBannerParams) {
    try {
      const result = await request.get<QueryTasksRes<'NationalBanner'>>(
        mesoorSpacePrefixUrl(`/mini-app/v1/banners`),
        { params },
        {
          handleResponseData: false,
          hideErrorMessage: true
        }
      );
      const res = transformBanners(result.data);
      return res.length ? res : defaultBanner;
    } catch (error) {
      return defaultBanner;
    }
  }
};

function transformBanners(data: TaskModel.Task<'SquareBanner' | 'NationalBanner'>[]) {
  const banners: Banner[] = data?.map((item) => {
    const fields = item.taskPayload?.payload?.data.standardFields;
    return {
      name: fields?.name ?? '',
      url: formatFileUrl(fields?.bannerFile.key ?? '', { forceCDN: true }),
      seats: fields?.bannerSeats ?? ''
    };
  });
  banners.sort((a, b) => a.seats.localeCompare(b.seats));
  return banners.length ? banners : defaultBanner;
}

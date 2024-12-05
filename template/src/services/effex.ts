import { request } from '.';
import { effexPrefixUrl } from '.';

export type GenerateRequirementsTaskType = '相关行业' | '产品领域' | '对标公司' | '职位名称' | '关键词' | '职位描述';

export type GenerateRequirementsParams = {
  text: string;
  task: GenerateRequirementsTaskType;
  /** 约束信息，例如选择【换一批】时，把当前内容传入，以屏蔽已有选项。话术：“已选择内容有：..., 请避开以上选项” */
  context?: string;
};

export type GenerateRequirementsResponse = Partial<{
  text: string;
  texts: string[];
  key_value: Record<string, string>;
}>;

export const effexService = {
  generateRequirements(params: GenerateRequirementsParams) {
    return request.post<GenerateRequirementsResponse>(
      effexPrefixUrl('/v1/generate/requirements'),
      {
        ...params
      },
      { handleResponseData: false }
    );
  }
};

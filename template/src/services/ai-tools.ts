import { request, mesoorAiToolsPrefixUrl } from '.';
type JdGenerateParams = {
  name: string;
  keywords?: string[];
};

type JdGenerateResponse = { qualification: string };

export const aiToolsService = {
  generateJobDescription(params: JdGenerateParams) {
    return request.post<JdGenerateResponse>(mesoorAiToolsPrefixUrl('/v1/models/moonshot/job-description'), params);
  }
};

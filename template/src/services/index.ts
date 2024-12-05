export { default as request, type ResponseData } from '@/utils/request';

export const mesoorUserPrefixUrl = (url: string) => String('/api/mesoor-user' + url);

export const mesoorSpacePrefixUrl = (url: string) => String('/api/mesoor-space' + url);

export const effexPrefixUrl = (url: string) => String('/api/effex-actions' + url);

export const mesoorAiToolsPrefixUrl = (url: string) => String('/api/mesoor-ai-tools' + url);

export const effexConfigsPrefixUrl = (url: string) => String('/api/effex-configs' + url);

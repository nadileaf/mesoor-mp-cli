import { request, mesoorSpacePrefixUrl } from '@/services';

class FileService {
  async upload<S extends string>({
    dir,
    ...params
  }: {
    dir?: `/${EntityModel.BusinessEntityType}${S}`;
    filePath: string;
    onUploadProgress?: (e: UniApp.OnProgressUpdateResult) => void;
  }) {
    const result = await request.upload<Common.NormalizedField.File>(
      mesoorSpacePrefixUrl(`/mini-app/v1/files/private${dir?.startsWith('/') ? dir : ''}`),
      params
    );
    return result;
  }

  async deleteObject(path: string) {
    try {
      const api = `/transmitter-attachment/v1/file/`;
      const fileKey = path.split(api).pop();
      await request.delete(api + fileKey, undefined, {
        hideErrorMessage: true
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new FileService();

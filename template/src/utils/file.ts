import { useRouter } from '@/hooks/useRouter';
import { formatFileUrl, formatImageUrl } from './format';
import { generateUrl, message } from './common';
import { Base64 } from 'js-base64';
import fileService from '@/services/file';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores';

/** 上传文件50M限制 */
export const UPLOAD_FILE_LIMIT_SIZE = 50 * 1024 * 1024;
export const UPLOAD_FILE_LIMIT_SIZE_MSG = '文件大小不能超过50MB';

export const COSImageStyleHandler = {
  s1x1: 'imageMogr2/thumbnail/!200x200r/interlace/0/lquality/80/crop/200x200/gravity/center',
  s4x3: 'imageMogr2/thumbnail/!200x150r/interlace/0/lquality/80/crop/200x150/gravity/center',
  m1x1: 'imageMogr2/thumbnail/!400x400r/interlace/0/lquality/80/crop/400x400/gravity/center',
  m4x3: 'imageMogr2/thumbnail/!400x300r/interlace/0/lquality/80/crop/400x300/gravity/center',
  m5x4: 'imageMogr2/thumbnail/!500x400r/interlace/0/lquality/80/crop/500x400/gravity/center',
  m16x9: 'imageMogr2/thumbnail/!400x225r/interlace/0/lquality/80/crop/400x225/gravity/center',
  l1x1: 'imageMogr2/thumbnail/!800x800r/interlace/0/lquality/80/crop/800x800/gravity/center',
  l4x3: 'imageMogr2/thumbnail/!800x600r/interlace/0/lquality/80/crop/800x600/gravity/center',
  l16x9: 'imageMogr2/thumbnail/!800x450r/interlace/0/lquality/80/crop/800x450/gravity/center',
  origin: 'imageMogr2/thumbnail/2000x2000>'
};

export const fileTypes = {
  image: ['gif', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'bmp', 'tif'],
  video: ['avi', 'flv', 'mov', 'wav', 'mkv', 'rmvb', 'mp4', 'webm', 'm3u8'],
  audio: ['mp3', 'm4a', 'wav', 'wma', 'flac', 'ape'],
  doc: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'md', 'htm']
};

/**
 * 加上 cdn 前缀 "https://cdn-fe.mesoor.com"
 */
export function withCdnPrefix(path: string) {
  return import.meta.env.VITE_STATIC_ASSETS_PREFIX + path;
}

export type FileType = keyof typeof fileTypes;

/** @description 获取文件后缀名,不包含. */
export function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase();
}

/** @description 获取文件类型的所有文件后缀名,支持多个 */
export function getFileExtNamesByTypes(types: FileType[]) {
  const res: string[] = [];
  for (const type of types) {
    const extNames = fileTypes[type];
    res.push(...extNames);
  }
  return res;
}

export function getFileType(fileName: string) {
  const extName = getFileExtension(fileName);
  if (!extName) return;
  for (const key in fileTypes) {
    if (fileTypes[key as FileType].includes(extName)) {
      return key as FileType;
    }
  }
}

export function getFileIcon(fileName: string) {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case 'doc':
    case 'docx':
      return withCdnPrefix('/tip-assets/img/icons/doc.png');
    case 'pdf':
      return withCdnPrefix('/tip-assets/img/icons/pdf.png');
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return withCdnPrefix('/tip-assets/img/icons/image.png');
    case 'html':
    case 'htm':
      return withCdnPrefix('/tip-assets/img/icons/html.png');
    case 'mp3':
    case 'm4a':
    case 'wav':
    case 'wma':
    case 'flac':
    case 'ape':
      return withCdnPrefix('/tip-assets/img/icons/audio.png');
    case 'mp4':
    case 'avi':
    case 'flv':
    case 'mov':
    case 'mkv':
    case 'rmvb':
      return withCdnPrefix('/tip-assets/img/icons/video.png');
    case 'xls':
    case 'xlsx':
    case 'csv':
      return withCdnPrefix('/tip-assets/img/icons/excel.png');
    case 'ppt':
    case 'pptx':
      return withCdnPrefix('/tip-assets/img/icons/ppt.png');
    case 'txt':
    case 'md':
      return withCdnPrefix('/tip-assets/img/icons/txt.png');
    default:
      return withCdnPrefix('/tip-assets/img/icons/other.png');
  }
}

/** @description 校验文件名 */
export function isValidFilename(filename: string): boolean {
  const regex = /^[.&'a-zA-Z0-9_-]+\.[a-zA-Z0-9]+(?:-\d+(?:\.\d*)?%-INC)?$/;
  return filename.match(regex) != null;
}

export function previewFiles(files: Common.NormalizedField.File[], index?: number) {
  if (!files.length) return message.error('文件不存在');
  const types = files.map((file) => getFileType(file.fileName));
  /** 如果全部是媒体文件 */
  if (types.every((type) => type && ['image', 'video'].includes(type))) {
    const sources = files.map((file) => {
      const type = getFileType(file.fileName);
      return {
        url: type === 'image' ? formatImageUrl(file.key, { size: 'origin' }) : formatFileUrl(file.key),
        type
      } as UniApp.MediaSource;
    });
    uni.previewMedia({ sources, current: index ?? 0 });
  } else if (files.length > 1) {
    useRouter().push('/packages/common/file-list', { data: { files } });
  } else {
    const file = files[index ?? 0];
    previewFile(file);
  }
}

function previewFile(file: Common.NormalizedField.File) {
  const type = getFileType(file.fileName);
  if (type === 'image' || type === 'video') {
    previewFiles([file]);
  } else {
    const url = formatFileUrl(file.key);
    const fileName = file.fileName;
    const urlParam = generateUrl(url, { fileName: fileName });
    const previewUrl = generateUrl(`${import.meta.env.VITE_API_URL}/preview/onlinePreview`, {
      url: Base64.encode(urlParam),
      watermarkTxt: useAuthStore().user?.username ?? ''
    });
    console.log('preview url', urlParam);
    console.log(previewUrl);
    useRouter().push('/packages/common/web-view', {
      query: { url: previewUrl, title: fileName }
    });
  }
}

type TempFile = {
  path: string;
  size: number;
  name?: string;
  videoInfo?: {
    duration: number;
    width: number;
    height: number;
    thumbTempFilePath: string;
  };
};
type UploadFileOptions = {
  dir?: string;
  /** 可选择的文件类型 */
  fileTypes: FileType[];
  limit?: number;
  /** 只有fileType是image、video生效， original 原图，compressed 压缩图，默认二者都有 */
  sizeType?: ('original' | 'compressed')[];
  /**只有fileType是image、video生效， album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项 */
  sourceType?: ('album' | 'camera')[];
  /** 只有fileType是image、video生效，拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。 */
  maxDuration?: number;
  /** 只有fileType是image、video生效，仅在 sourceType 为 camera 时生效，使用前置或后置摄像头 */
  camera?: 'front' | 'back';
  /** 上传前校验 */
  onBeforeUpload?: (tempFiles: TempFile[]) => boolean | Promise<boolean>;
  /** 上传时钩子 */
  onProgress?: (e: UniApp.OnProgressUpdateResult, tempFile: TempFile, index: number) => void;
  /** 上传成功钩子 */
  onSuccess?: (data: Common.NormalizedField.File, tempFile: TempFile, index: number) => void;
  /** 上传失败钩子 */
  onError?: (error: any) => void;
};
export async function uploadFiles(params: UploadFileOptions) {
  const tempFiles = await selectFile(params);
  console.log('tempFiles', tempFiles);
  if (params.onBeforeUpload) {
    const res = await params.onBeforeUpload(tempFiles);
    if (!res) return Promise.reject('onBeforeUpload error');
  }
  const successFiles: Common.NormalizedField.File[] = [];
  await Promise.allSettled(
    tempFiles.map(async (tempFile, index) => {
      await validateFile(tempFile, params.fileTypes);
      return fileService
        .upload({
          dir: (params.dir as any) ?? `/${import.meta.env.VITE_AUTH_TENANT_ID}/attachment`,
          filePath: tempFile.path,
          onUploadProgress: (e) => params.onProgress?.(e, tempFile, index)
        })
        .then((res) => {
          const fileData: Common.NormalizedField.File = {
            key: res.key,
            fileName: res.fileName ?? tempFile.name ?? '',
            extension: res.extension ?? getFileExtension(tempFile.name ?? ''),
            size: res.size ?? tempFile.size,
            createdAt: res.createdAt ?? dayjs().toISOString(),
            createdBy: res.createdBy ?? {
              openId: useAuthStore().user?.userId ?? ''
            }
          };
          params.onSuccess?.(fileData, tempFile, index);
          successFiles.push(fileData);
          return fileData;
        })
        .catch((error) => {
          params.onError?.(error);
          return Promise.reject(error);
        });
    })
  );
  return successFiles;
}

enum ActionSheet {
  Message = '从微信聊天中选择',
  Album = '从相册中选择'
}
const mediaTypes = ['image', 'video'];
async function selectFile(params: UploadFileOptions): Promise<TempFile[]> {
  const _fileTypes = params?.fileTypes ?? ['image'];

  const onlyChooseMessageFile = _fileTypes.every((type) => mediaTypes.includes(type));

  const actionSheetItems = onlyChooseMessageFile ? [ActionSheet.Message] : [ActionSheet.Album, ActionSheet.Message];
  const { tapIndex: index } = await uni.showActionSheet({
    alertText: '请选择',
    itemList: actionSheetItems
  });
  return new Promise((resolve, reject) => {
    if (actionSheetItems[index] === ActionSheet.Message) {
      const extension = _fileTypes.reduce((prev, cur) => prev.concat(fileTypes[cur].map((ext) => `.${ext}`)), [] as string[]);
      const type =
        _fileTypes.length === 1 && mediaTypes.includes(_fileTypes[0])
          ? (_fileTypes[0] as UniApp.ChooseMessageFileOption['type'])
          : _fileTypes.some((type) => mediaTypes.includes(type))
          ? 'all'
          : 'file';
      console.log('chooseMessageFile type', type);
      uni.chooseMessageFile({
        count: params?.limit ?? 1,
        type,
        extension,
        success(res) {
          resolve(res.tempFiles);
        },
        fail(res) {
          reject(res);
        }
      });
    } else {
      uni.chooseMedia({
        count: params?.limit ?? 1,
        mediaType: _fileTypes.filter((item) => mediaTypes.includes(item)) as UniApp.ChooseMediaOption['mediaType'],
        sourceType: params?.sourceType ?? ['album', 'camera'],
        maxDuration: params?.maxDuration,
        camera: params?.camera,
        success(res) {
          const result = res.tempFiles.map(({ tempFilePath: path, size, ...videoInfo }) => ({
            path,
            size,
            videoInfo
          }));
          resolve(result);
        },
        fail(res) {
          reject(res);
        }
      });
    }
  });
}

async function validateFile(file: TempFile, fileTypes: FileType[]) {
  const exts = getFileExtNamesByTypes(fileTypes);
  const isValidFileType = file.path.match(new RegExp(`\\.(${exts.join('|')})$`, 'i'));
  if (!isValidFileType) {
    message.error('不支持的文件类型');
    return Promise.reject('不支持的文件类型');
  } else if (file.size >= UPLOAD_FILE_LIMIT_SIZE) {
    message.error(UPLOAD_FILE_LIMIT_SIZE_MSG);
    return Promise.reject(UPLOAD_FILE_LIMIT_SIZE_MSG);
  }
}

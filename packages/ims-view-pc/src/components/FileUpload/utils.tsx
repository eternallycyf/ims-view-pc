import { message, UploadProps } from 'antd';
import axios from 'axios';
import { Icon as IconFont } from 'ims-view-pc';
import _ from 'lodash';
import { IconProps } from '../Icon';
import { IFileUploadDetailProps, IFileUploadProps, IHandleFileChange } from './interface';

export const AFTER_NAMES = [
  '.exe',
  '.bat',
  '.xml',
  '.acp',
  '.dll',
  '.vbs',
  'chm',
  '.cmd',
  '.jsp',
  '.php',
  '.html',
  '.aspx',
];

// eslint-disable-next-line no-useless-escape
export const BAFAULT_NAMES = `.%'&\></${'`'}~:--`.split('');
export const MAX_SIZE = 100;

export function Icon({
  path,
  className,
  onClick,
}: {
  path: IconProps['type'];
  className?: string;
  onClick?: any;
}) {
  return <IconFont className={className} onClick={onClick} type={path} />;
}

export const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const { name, size } = file;
  const afterName = name.slice(name.lastIndexOf('.'));
  const beforeName = name.slice(0, name.lastIndexOf('.'));

  const maxSizeLength = MAX_SIZE * 1024 * 1024;
  if (size > maxSizeLength) {
    message.error(`文件大小最大不能超过${MAX_SIZE}M`);
    return false;
  }
  if (AFTER_NAMES.includes(afterName)) {
    message.error('不支持上传该类型文件!');
    return false;
  }
  if (BAFAULT_NAMES.some((item) => beforeName.includes(item))) {
    message.error(`文件名不能包含特殊字符! ${BAFAULT_NAMES.join('')}`);
    return false;
  }
  return true;
};

export const handleAttachmentDelete = (
  fileParams: IFileUploadDetailProps & {
    fileId?: string | number;
    fileKeys: IFileUploadProps['fileKeys'];
  },
) => {
  const { fileId, fileList, setFileList, fileKeys } = fileParams;
  const newValue = _.cloneDeep(fileList);
  const index = newValue.findIndex((item) => item?.[fileKeys?.fileId] === fileId);
  if (index != -1) {
    newValue.splice(index, 1);
    setFileList(newValue);
  }
};

export const handleAttachmentReplace = (
  fileParams: IFileUploadDetailProps & { index: number; fileKeys: IFileUploadProps['fileKeys'] },
) => {
  const { uploadRef, fileList, setReplaceIndex, index, fileKeys } = fileParams;
  setReplaceIndex(index);

  console.log(uploadRef.current);

  if (uploadRef.current.upload) {
    uploadRef.current.upload.uploader.onClick({ target: {} });
  } else {
    uploadRef.current.click();
  }
};

export const handleFileChange: IHandleFileChange = (
  fileParams,
  setFileList,
  replaceIndex,
  fileKeys,
) => {
  const { file, extraRecord, defaultList } = fileParams;
  const { name, uid, status, percent } = file;
  const currrentIndex = replaceIndex;
  if (status) {
    let newFile = {
      [fileKeys?.fileName]: name,
      [fileKeys?.fileId]: uid,
      status,
      percent,
      ...extraRecord,
    };
    let isSuccess = true;

    if (status === 'error') {
      message.error('上传失败');
      isSuccess = false;
    }

    if (status === 'done') {
      const code = file?.response?.code;
      const data = file?.response?.data;
      if (code == 0 || code == 200) {
        newFile = { ...newFile, ...data, ...extraRecord };
      } else {
        message.error('上传失败');
        isSuccess = false;
      }
    }

    const cloneDeepDefaultValue = _.cloneDeep(defaultList) || [];
    const index =
      currrentIndex == -1
        ? cloneDeepDefaultValue.findIndex((item) => item?.[fileKeys?.fileId] === uid)
        : currrentIndex;
    if (index > -1) {
      isSuccess
        ? cloneDeepDefaultValue.splice(index, 1, newFile)
        : cloneDeepDefaultValue.splice(index, 1);
    } else {
      cloneDeepDefaultValue.push(newFile);
    }

    setFileList(cloneDeepDefaultValue);
  }
};

export function exportFile(url: string, params: any) {
  return axios.get(url, {
    params,
    responseType: 'blob',
  });
}

/**
 * 下载文件
 * @param searchParams
 * @param options
 * @param callback
 */
export const handleDownload = (
  searchParams: any,
  options = { url: '', fileName: '' },
  callback?: () => void,
) => {
  exportFile(options.url, searchParams).then((response: any) => {
    response.blob().then((blob: Blob) => {
      if (response.status === 200) {
        if (window.navigator && (window as any).navigator.msSaveOrOpenBlob) {
          (window as any).navigator.msSaveOrOpenBlob(blob, options.fileName);
        } else {
          const blobUrl = window.URL.createObjectURL(blob);
          const aElement = document.createElement('a');
          const fileName = options.fileName;
          aElement.href = blobUrl;
          aElement.download = fileName;
          aElement.click();
          window.URL.revokeObjectURL(blobUrl);
        }
      } else if (callback) callback();
    });
  });
};

export const postDownloadFile = (url: string, fileName: string, data: any = {}) => {
  function download(url: string, data: any) {
    return axios(`/file/downloadByUrl`, {
      method: 'get',
      responseType: 'blob',
      params: { url },
      data,
    });
  }
  return download(url, data).then((data: any) => {
    if (!data || data?.size == 0) {
      message.error('文件不存在');
      return;
    }
    if (window.navigator && typeof (window as any).navigator.msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(new Blob([data]), fileName);
    } else {
      const url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  });
};

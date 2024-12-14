import { message, UploadProps } from 'antd';
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

// 根据URL下载图片
function downloadImgURL(url, name) {
  let image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.src = url;
  image.onload = () => {
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = name;
      a.href = url;
      a.click();
      a.remove();
      // 用完释放URL对象
      URL.revokeObjectURL(url);
      message.success('下载成功');
    });
  };
}

export const postDownloadFile = (params: { url: string; fileName: string; fileId?: any }) => {
  const { url, fileName, fileId } = params;
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
    });
};

export const handleDownloadByDefault = (params: {
  url: string;
  fileName: string;
  fileId: string;
}) => {
  const { url, fileName, fileId } = params;

  if (!url || !fileId) {
    message.error('文件不存在');
    return;
  }

  // 判断是图片后缀
  const isImg = /\.(jpeg|jpg|gif|png|bmp|webp)$/.test(fileName);

  if (isImg) {
    downloadImgURL(url, fileName);
  } else {
    postDownloadFile({ url, fileName, fileId });
  }
};

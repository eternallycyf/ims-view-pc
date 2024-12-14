import { IButtonProps, type FileViewer, type LiteralUnion } from 'ims-view-pc';

import { FormItemProps, UploadFile, UploadProps } from 'antd';
import type { RefObject } from 'react';

export interface UploadConfig {
  label?: string;
  tooltip?: string;
  isRequired?: boolean;

  /**
   * @name 拓展的文件信息 和文件名同级
   */
  extraRecord?: any;

  extra?: IButtonProps[] | [];
  headerItemProps?: FormItemProps;
}

export interface FileUploadProps {
  header?: any;

  config?: UploadConfig;
  actionUrl?: string;
  isDetail?: boolean;
  colNumber?: number;
  maxCount?: number;

  fileKeys?: {
    fileName?: string;
    fileId?: string;
    url?: string;
  };
  uploadProps?: UploadProps<FileListResponse>;

  /**
   * @name 集成到antd
   */
  value?: Attachment[];
  onChange?: (fileList: Attachment[]) => void;
}

export type HandleFileChange = {
  (
    info: {
      file: UploadFile<FileListResponse>;
      fileList: UploadFile<FileListResponse>[];
      extraRecord: any;
      defaultList: Attachment[];
    },
    setFileList: React.Dispatch<React.SetStateAction<Attachment[]>>,
    replaceIndex: number,
    fileKeys: FileUploadProps['fileKeys'],
  ): void;
};

export type Attachment = {
  uploadDateTime?: string;
  fileId?: string;
  id?: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
  status: LiteralUnion<UploadProps['fileList'][number]['status']>;
  percent: number;
  [props: string]: any;
};

export type FileListResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: Attachment;
};

export interface FileUploadDetailProps
  extends Pick<FileUploadProps, 'isDetail' | 'colNumber' | 'fileKeys'> {
  fileList: Attachment[];
  setFileList: React.Dispatch<React.SetStateAction<Attachment[]>>;
  setReplaceIndex: React.Dispatch<React.SetStateAction<number>>;
  uploadRef: React.MutableRefObject<any>;
  FileViewerRef: RefObject<InstanceType<typeof FileViewer>>;
}

export interface FileImageProps {
  fileName: string;
  style?: React.CSSProperties;
  className?: string;
}

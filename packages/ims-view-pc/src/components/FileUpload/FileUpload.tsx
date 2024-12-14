import { CloudUploadOutlined } from '@ant-design/icons';
import { Divider, Form, Upload, UploadProps } from 'antd';
import { AccessBtn, FileViewer, variables } from 'ims-view-pc';
import { useEffect, useRef, useState } from 'react';
import Detail from './Detail';
import './index.less';
import { Attachment, FileListResponse, FileUploadProps } from './interface';
import { beforeUpload, handleFileChange } from './utils';

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { value = [], onChange } = props;
  const [fileList, setFileList] = useState<Attachment[]>(value);
  const [replaceIndex, setReplaceIndex] = useState<number>(-1);
  const uploadWrapperRef = useRef<any>(null!);
  const FileViewerRef = useRef<InstanceType<typeof FileViewer>>(null!);

  const {
    config,
    actionUrl: defaultActionUrl,
    fileKeys: defaultFileKeys,
    isDetail = false,
    colNumber = 24,
    header = {},
    uploadProps: defaultUploadProps,
    maxCount = null,
  } = props;
  const { headerItemProps = {}, extraRecord } = config || {};
  const actionUrl = defaultActionUrl || `flow/upload`;
  const fileKeys = {
    fileName: defaultFileKeys?.fileName || 'fileName',
    fileId: defaultFileKeys?.fileId || 'id',
    url: defaultFileKeys?.url || 'url',
  };

  useEffect(() => {
    onChange && onChange(fileList);
  }, [fileList]);

  useEffect(() => {
    if (Array.isArray(value) && value?.length > fileList?.length) {
      setFileList(value);
    }
  }, [value]);

  const defaultHeaderFormItemProps = {
    label: config?.label,
    tooltip: config?.tooltip,
    required: config?.isRequired,
    wrapperCol: { style: { textAlign: 'right' as 'right' } },
    colon: config?.extra ? true : false,
    style: { marginBottom: 0, ...headerItemProps?.style },
    ...headerItemProps,
  };

  const uploadFormItemProps = {};
  const UploadProps: UploadProps<FileListResponse> = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    headers: header,
    action: actionUrl,
    beforeUpload,
    onChange: (info) => {
      const params = {
        ...info,
        extraRecord,
        defaultList: fileList,
      };
      handleFileChange(params, setFileList, replaceIndex, fileKeys);
    },
    style: {
      marginBottom: 0,
      width: maxCount && (fileList || [])?.length >= maxCount ? 0 : '100%',
    },
    maxCount,
    ...defaultUploadProps,
  };
  const UploadDraggerContent = (
    <div>
      <CloudUploadOutlined /> 将文件拖到此处或 <span className="btn-link">点击上传</span>
    </div>
  );

  const detailProps = {
    isDetail,
    colNumber,
    fileList,
    setFileList,
    setReplaceIndex,
    uploadRef: uploadWrapperRef,
    fileKeys,
    FileViewerRef,
  };

  if (isDetail) return <Detail {...detailProps} />;

  return (
    <div className="FileUpload" style={{ '--colorPrimary': variables?.colorPrimary }}>
      <div className="uploadContent" style={{ marginTop: fileList?.length != 0 ? 10 : 0 }}>
        {(config?.extra || config?.label) && (
          <Form.Item className="header" layout="horizontal" {...defaultHeaderFormItemProps}>
            <AccessBtn
              btnList={
                config?.extra &&
                (config?.extra as any[]).map((item) => ({
                  ...item,
                  size: item?.size || 'middle',
                }))
              }
            />
          </Form.Item>
        )}
        {fileList?.length != 0 && (
          <Form.Item>
            <Detail {...detailProps} />
          </Form.Item>
        )}
        {(fileList?.length != 0 || config?.extra || config?.label) && (
          <Divider dashed style={{ color: '#DEE1E7', margin: '4px 0 0 0' }} />
        )}
        <Form.Item {...uploadFormItemProps}>
          <div onClick={() => setReplaceIndex(-1)}>
            <Upload.Dragger {...UploadProps} ref={uploadWrapperRef}>
              {maxCount != null && maxCount <= fileList?.length ? null : UploadDraggerContent}
            </Upload.Dragger>
          </div>
        </Form.Item>
      </div>
      <FileViewer ref={FileViewerRef} />
    </div>
  );
};

export default FileUpload;

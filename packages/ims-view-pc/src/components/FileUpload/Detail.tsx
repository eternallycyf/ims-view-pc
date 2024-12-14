import {
  CheckCircleFilled,
  DeleteOutlined,
  DiffOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Col, Progress, Row, Space, Spin, Tooltip } from 'antd';
import { AccessBtn, CustomTooltip } from 'ims-view-pc';
import { FC } from 'react';
import FileImage from './FileImage';
import './index.less';
import { Attachment, FileUploadDetailProps } from './interface';
import {
  getBase64,
  getFileBlob,
  handleAttachmentDelete,
  handleAttachmentReplace,
  handleDownloadByDefault,
  isImg,
} from './utils';

const Detail: FC<FileUploadDetailProps> = (props) => {
  const {
    isDetail,
    colNumber,
    fileList = [],
    setFileList,
    setReplaceIndex,
    uploadRef,
    fileKeys,
    FileViewerRef,
  } = props;

  const _getPercent = (item: any) => {
    return item?.percent == undefined
      ? 100
      : item?.status == 'uploading' && item?.percent == 100
      ? 90
      : item?.percent;
  };

  const handleReplace = (index: number) => {
    handleAttachmentReplace({ index, fileKeys, ...props });
  };

  const handleDelete = (item: Attachment) => {
    handleAttachmentDelete({ fileKeys, fileId: item?.[fileKeys?.fileId], ...props });
  };

  const handlePreview = async (item: Attachment) => {
    const result: any = await getFileBlob(item?.url, item);

    if (isImg(item?.[fileKeys?.fileName])) {
      getBase64(result, (base64Url) => {
        FileViewerRef.current.controlIsShow({
          base64: base64Url as any,
          fileName: item?.[fileKeys?.fileName],
        });
      });
    } else {
      FileViewerRef.current.controlIsShow({
        src: item?.url,
        fileName: item?.[fileKeys?.fileName],
      });
    }
  };

  const handleDownload = (item: Attachment) => {
    return handleDownloadByDefault({
      url: item?.url,
      fileName: item?.[fileKeys?.fileName],
      fileId: item?.[fileKeys?.fileId],
    });
  };

  const renderContent = (item: Attachment, index: number) => {
    const isLoading = item?.status === 'uploading';
    const fileName = item?.[fileKeys?.fileName];

    const getDeleteIcon = () => {
      if (isDetail || !item?.[fileKeys?.fileId]) return null;

      if (item?.status == 'done')
        return (
          <span>
            <span className="success">
              <CheckCircleFilled className="success-color" />
            </span>
            <span className="delete" onClick={() => handleDelete(item)}>
              <DeleteOutlined className="error-color" />
            </span>
          </span>
        );
      return <Spin indicator={<LoadingOutlined />} spinning size="small" />;
    };

    return (
      <div className="DetailCard">
        <Row justify="space-between" gutter={16} align="middle" wrap={false}>
          {isLoading ? (
            <Spin size="small" />
          ) : (
            <Space align="center">
              <FileImage fileName={fileName} />
              <CustomTooltip rows={1} content={fileName} />
            </Space>
          )}

          <div style={{ marginLeft: 10 }}>
            <AccessBtn
              btnList={[
                {
                  element: (
                    <Tooltip title="查看">
                      <EyeOutlined
                        onClick={() => handlePreview(item)}
                        className="primary-color"
                        style={{
                          cursor: 'pointer',
                        }}
                      />
                    </Tooltip>
                  ),
                  type: 'custom',
                },
                {
                  element: isLoading ? (
                    <Spin size="small" spinning />
                  ) : (
                    <Tooltip title="替换">
                      <DiffOutlined
                        className="primary-color"
                        onClick={() => handleReplace(index)}
                      />
                    </Tooltip>
                  ),
                  type: 'custom',
                  visible: () => item?.[fileKeys?.fileId] && !isDetail,
                },
                {
                  element: (
                    <Tooltip title="下载">
                      <DownloadOutlined
                        className="primary-color"
                        onClick={() => handleDownload(item)}
                      />
                    </Tooltip>
                  ),
                  type: 'custom',
                },
                {
                  element: isLoading ? <Spin size="small" spinning /> : getDeleteIcon(),
                  type: 'custom',
                  visible: () => item?.fileId && !isDetail,
                },
              ]}
            />
          </div>
        </Row>
        {!isDetail && (
          <Progress
            className="progress"
            showInfo={false}
            strokeWidth={2}
            percent={_getPercent(item)}
            status="active"
          />
        )}
      </div>
    );
  };

  if (!fileList || fileList?.length === 0) return null;

  return (
    <Row className="Detail" gutter={[12, 12]} justify="start" align="middle" wrap>
      {(fileList || []).map((item, index) => {
        return (
          <Col md={colNumber || 24} xs={24} sm={24} key={index}>
            {renderContent(item, index)}
          </Col>
        );
      })}
    </Row>
  );
};

export default Detail;

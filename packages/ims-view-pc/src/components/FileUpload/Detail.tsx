import {
  CheckCircleFilled,
  DeleteOutlined,
  DiffOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Col, Form, Progress, Row, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { AccessBtn, Ellipsis, variables } from 'ims-view-pc';
import { FC } from 'react';
import './index.less';
import { IFileListExtraRecord, IFileUploadDetailProps } from './interface';
import { handleAttachmentDelete, handleAttachmentReplace, handleDownloadByDefault } from './utils';

const FileImage = () => <div>FileImage</div>;
const FileView = () => <div>FileView</div>;

const Detail: FC<IFileUploadDetailProps> = (props) => {
  const {
    isDetail,
    colNumber,
    fileList = [],
    setFileList,
    setReplaceIndex,
    uploadRef,
    fileKeys,
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

  const handleDelete = (item: IFileListExtraRecord) => {
    handleAttachmentDelete({ fileKeys, fileId: item?.[fileKeys?.fileId], ...props });
  };

  const getViewUrl = (item: IFileListExtraRecord) => {
    return `/ims/org/cust/download?id=${item?.[fileKeys?.fileId]}`;
  };

  const handleDownload = (item: IFileListExtraRecord) => {
    return handleDownloadByDefault({
      url: item?.url,
      fileName: item?.[fileKeys?.fileName],
      fileId: item?.[fileKeys?.fileId],
    });
  };

  const renderContent = (item: IFileListExtraRecord, index: number) => {
    const isLoading = item?.status === 'uploading';
    const fileName = item?.[fileKeys?.fileName];

    const getDeleteIcon = () => {
      if (isDetail || !item?.[fileKeys?.fileId]) return null;

      if (item?.status == 'done')
        return (
          <span>
            <span className="success">
              <CheckCircleFilled style={{ color: variables.colorSuccess }} />
            </span>
            <span className="delete" onClick={() => handleDelete(item)}>
              <DeleteOutlined style={{ color: variables.colorError }} />
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
            <Ellipsis.Expand
              style={{ marginRight: 2 }}
              rows={1}
              direction="middle"
              content={fileName}
              tooltip={
                <>
                  <Form.Item style={{ marginBottom: 0 }} label="文件名">
                    {fileName}
                  </Form.Item>
                  {item?.uploadDateTime ? (
                    <Form.Item style={{ marginBottom: 0 }} label="上传时间">
                      {dayjs(item?.uploadDateTime).format('YYYY-MM-DD HH:mm:ss')}
                    </Form.Item>
                  ) : null}
                </>
              }
            />
          )}

          <AccessBtn
            btnList={[
              {
                element: (
                  <Tooltip title="查看">
                    <EyeOutlined style={{ color: variables.colorInfo, cursor: 'pointer' }} />
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
                      style={{ color: variables.colorInfo }}
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
                      style={{ color: variables.colorInfo }}
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

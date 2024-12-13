import {
  CheckCircleFilled,
  DeleteOutlined,
  DiffOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Col, Progress, Row, Spin, Tooltip } from 'antd';
import { AccessBtn, Ellipsis, variables } from 'ims-view-pc';
import { FC } from 'react';
import './index.less';
import { IFileListExtraRecord, IFileUploadDetailProps } from './interface';
import {
  handleAttachmentDelete,
  handleAttachmentReplace,
  handleDownload as handleDownloadByDefault,
  postDownloadFile,
} from './utils';

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
    isDownloadByS3,
    maxLength,
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
    return isDownloadByS3
      ? `/ims-base/file/downloadByUrl?url=${item?.[fileKeys?.url]}`
      : `/ims/org/cust/download?id=${item?.[fileKeys?.fileId]}`;
  };

  const handleDownload = (item: IFileListExtraRecord) => {
    return isDownloadByS3
      ? postDownloadFile(item?.[fileKeys?.url], item?.fdFileName || item?.[fileKeys?.fileName])
      : handleDownloadByDefault(
          { id: item?.[fileKeys?.fileName] },
          {
            url: `/ims/org/cust/download`,
            fileName: item?.fdFileName || item?.[fileKeys?.fileName],
          },
        );
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
              tooltip={fileName}
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
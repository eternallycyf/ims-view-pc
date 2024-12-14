import { message, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';
import FileView from './FileView';
const txtFileTypes = [
  'txt',
  'json',
  'js',
  'css',
  'java',
  'py',
  'html',
  'jsx',
  'ts',
  'tsx',
  'xml',
  'md',
  'log',
];

const fileAllTypes = ['docx', 'xlsx', 'png', 'jpg', 'pdf', ...txtFileTypes];
class FilePreView extends PureComponent<any, any> {
  protected pdfViewRef: React.RefObject<any> = React.createRef();
  protected previewWrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      fileType: '',
      excelData: {
        cols: [],
        rows: [],
      },
    };
  }
  //显隐状态的改变
  controlIsShow = (params: {
    src?: string;
    base64?: string;
    originFileObj?: any;
    fileName?: string;
  }) => {
    const { modalVisible } = this.state;
    const { src, base64, originFileObj = {}, fileName } = params;
    const { name: defaultName = '' } = originFileObj;
    const name = fileName || defaultName;
    const fileType = name.slice(name.lastIndexOf('.') + 1).toLowerCase();

    if (!fileAllTypes.includes(fileType)) {
      return message.error('该文件不支持预览');
    }
    if (fileType == 'xlsx') {
      ExcelRenderer(originFileObj, (err: Error, resp: any) => {
        this.setState({
          excelData: {
            cols: resp.cols,
            rows: resp.rows,
          },
        });
      });
    }
    this.setState({
      modalVisible: !modalVisible,
      src,
      base64,
      fileType,
    });
  };

  render() {
    const { modalVisible, src, base64, fileType, excelData } = this.state;
    return (
      <Modal
        open={modalVisible}
        title={fileType + ' 预览'}
        onCancel={() => {
          this.setState({
            modalVisible: false,
          });
        }}
        width={1200}
        styles={{
          body: {
            overflow: 'scroll',
            height: '70vh',
          },
        }}
        footer={null}
        destroyOnClose={true}
      >
        <FileView
          id="file-preview-modal"
          ref={this.pdfViewRef}
          src={src}
          base64={base64}
          fileType={fileType}
          excelData={excelData}
          txtFileTypes={txtFileTypes}
          styles={{ height: '600px' }}
        />
      </Modal>
    );
  }
}
export default FilePreView;

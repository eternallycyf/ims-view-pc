import { Image, message, Modal } from 'antd';
import axios from 'axios';
import React, { PureComponent } from 'react';
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

async function getBlobData(src) {
  const url = src;
  const res = await axios.get(url, {
    responseType: 'blob',
  });
  const blob = res.data;
  return blob;
}

const getBase64 = (file: Blob, cb: (result: string | ArrayBuffer | null) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => cb(reader.result));
  reader.readAsDataURL(file);
};

const fileAllTypes = ['docx', 'xlsx', 'png', 'jpg', 'pdf', ...txtFileTypes];
class FilePreView extends PureComponent<any, any> {
  protected pdfViewRef: React.RefObject<InstanceType<typeof FileView>> = React.createRef();
  protected previewWrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      fileType: '',
      imageVisible: false,
    };
  }
  //显隐状态的改变
  controlIsShow = async (params: {
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
    const isImage = fileType == 'png' || fileType == 'jpg';

    if (isImage) {
      getBase64(originFileObj, (fileURL: string | ArrayBuffer | null) => {
        this.setState({
          src,
          base64: fileURL,
          imageVisible: !this.state.imageVisible,
        });
      });
      return;
    }

    if (!src) {
      const blob = new Blob([originFileObj], { type: originFileObj.type });
      const url = URL.createObjectURL(blob);

      this.setState({
        modalVisible: !modalVisible,
        src: url,
        base64,
        fileType,
      });
      return;
    }

    this.setState({
      modalVisible: !modalVisible,
      src,
      base64,
      fileType,
    });
  };

  render() {
    const { modalVisible, src, base64, fileType, imageVisible } = this.state;

    return (
      <>
        <Image
          style={{ display: 'none' }}
          width={200}
          src={src || base64}
          preview={{
            visible: imageVisible,
            src: src || base64,
            onVisibleChange: (value) => {
              this.setState({ imageVisible: value });
            },
          }}
        />
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
            txtFileTypes={txtFileTypes}
            styles={{ height: '600px' }}
          />
        </Modal>
      </>
    );
  }
}
export default FilePreView;

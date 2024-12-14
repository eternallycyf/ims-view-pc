import { Button, Form, Table, Upload } from 'antd';
import { FileViewer } from 'ims-view-pc';
import { useRef } from 'react';
import { columns, dataSource } from './constant';

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};

const getBase64 = (file: Blob, cb: (result: string | ArrayBuffer | null) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => cb(reader.result));
  reader.readAsDataURL(file);
};

const PdfPage = () => {
  const pdfRef = useRef<any>(null!);
  const [form] = Form.useForm();

  const handlePreviewPdf = ({ originFileObj }: any) => {
    // 1.base64方式预览
    getBase64(originFileObj, (fileURL: string | ArrayBuffer | null) => {
      pdfRef.current.controlIsShow({
        base64: fileURL,
        originFileObj,
      });
    });
    // 2.src方式预览 通过后端接口获取src路径
    // pdfRef.current.controlIsShow({
    //   src: "http://marsgis.cn/doc/study-gis.pdf",
    // });
  };

  return (
    <>
      <Form form={form}>
        <h2>点击文件名即可预览</h2>
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
            onPreview={(file) => handlePreviewPdf(file)}
            beforeUpload={() => {
              return false;
            }}
            name="file"
            maxCount={10}
          >
            <Button>上传word excel pdf 图片等格式</Button>
          </Upload>
        </Form.Item>
      </Form>
      <FileViewer ref={pdfRef} />
      <Table pagination={false} dataSource={dataSource} columns={columns} />
    </>
  );
};

export default PdfPage;

import { Button, Form, Table, Upload } from 'antd';
import { FileViewer } from 'ims-view-pc';
import { useRef } from 'react';
import { columns, dataSource } from './constant';

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};

const PdfPage = () => {
  const pdfRef = useRef<any>(null!);
  const [form] = Form.useForm();

  const handlePreviewPdf = ({ originFileObj }: any) => {
    pdfRef.current.controlIsShow({
      originFileObj,
    });
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

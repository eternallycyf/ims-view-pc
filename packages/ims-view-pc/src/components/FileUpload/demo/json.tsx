import { random } from '@ims-view/utils';
import { Form, type UploadProps } from 'antd';
import { CustomForm, FileUpload, FormRules, type Attachment } from 'ims-view-pc';
import { useRef } from 'react';

interface IFormValues {
  file?: Attachment[];
  customFile?: Attachment[];
}

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = isProd
  ? 'https://ims-view-pc-eternallycyfs-projects.vercel.app'
  : 'http://localhost:8000/ims-view-pc';

const initFileList: Attachment[] = [
  {
    fileName: 'origin.png',
    id: 'rc-upload-1734098585253-8',
    status: 'done',
    percent: 100,
    fileId: '1',
    uploadDateTime: '2023-04-07T07:06:05.000Z',
    url: `${baseUrl}/images/origin.png`,
  },
  {
    fileName: 'word.docx',
    id: 'rc-upload-1734098585253-10',
    status: 'done',
    percent: 100,
    fileId: 'b6bdc21f-6d82-47ed-b329-6d47af66e9af',
    url: `${baseUrl}/word.docx`,
  },
  {
    fileName: '1.json',
    id: 'rc-upload-1734098585253-12',
    status: 'done',
    percent: 100,
    fileId: '14a57c3a-0864-409e-ab3b-3e5510d9c8dc',
    url: `${baseUrl}/1.json`,
  },
  {
    fileName: 'excel.xlsx',
    id: 'rc-upload-1734098585253-15',
    status: 'done',
    percent: 100,
    fileId: 'excelxlsx',
    url: `${baseUrl}/excel.xlsx`,
  },
  {
    fileName: 'pdf.pdf',
    id: 'rc-upload-1734098585253-16',
    status: 'done',
    percent: 100,
    fileId: 'pdf',
    url: `${baseUrl}/pdf.pdf`,
  },
];

const App: React.FC = () => {
  const [form] = Form.useForm<IFormValues>();

  return (
    <>
      <div style={{ maxWidth: 620 }}>
        <CustomForm<IFormValues, {}, 'normal'>
          modalType="normal"
          form={form}
          formProps={{ form, layout: 'vertical' }}
          onFinish={async (values) => {
            console.log(values);
          }}
          initialValues={{
            file: initFileList,
            customFile: initFileList,
          }}
          formList={[
            {
              label: 'JSON上传文件',
              name: 'customFile',
              type: 'upload',
              col: 24,
              itemProps: {
                rules: FormRules.withName('JSON上传文件').isRequired().create(),
              },
              controlProps: {
                maxCount: 5,
                colNumber: 12,
                config: {
                  label: 'JSON上传文件',
                  tooltip: '最多上传5个',
                  isRequired: true,
                  extraRecord: {},
                  extra: [
                    {
                      element: '测试按钮',
                      itemProps: {
                        buttonProps: {
                          style: {},
                          size: 'small',
                        },
                      },
                    },
                  ],
                  headerItemProps: {
                    style: {
                      marginBottom: 2,
                    },
                  },
                },
              },
            },
          ]}
        />
      </div>
    </>
  );
};

export default App;

import { random } from '@ims-view/utils';
import { Form, type UploadProps } from 'antd';
import { CustomForm, FileUpload, FormRules, type Attachment } from 'ims-view-pc';
import { useRef } from 'react';

interface IFormValues {
  file: Attachment[];
}

const App: React.FC = () => {
  const [form] = Form.useForm<IFormValues>();

  const customRequest: UploadProps['customRequest'] = async ({
    data,
    file,
    filename,
    onProgress,
    onSuccess,
  }) => {
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] as string);
      });
    }
    formData.append(filename, file);

    onProgress({ percent: 0 }, file);

    setTimeout(() => {
      onProgress({ percent: 100 }, file);

      const uuid = random.getUUID();

      onSuccess(
        {
          code: 200,
          message: '上传成功',
          success: true,
          data: {
            uploadDateTime: '2023-04-07T07:06:05.000Z',
            fileId: uuid,
            fileName: `${uuid}.png`,
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        },
        file,
      );
    }, 1000);

    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  };

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
            file: [
              {
                fileName: 'origin.png',
                id: 'rc-upload-1734098585253-8',
                status: 'done',
                percent: 100,
                fileId: '1',
                uploadDateTime: '2023-04-07T07:06:05.000Z',
                url: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/images/origin.png',
              },
              {
                fileName: 'word.docx',
                id: 'rc-upload-1734098585253-10',
                status: 'done',
                percent: 100,
                fileId: 'b6bdc21f-6d82-47ed-b329-6d47af66e9af',
                url: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/word.docx',
              },
              {
                fileName: '1.json',
                id: 'rc-upload-1734098585253-12',
                status: 'done',
                percent: 100,
                fileId: '14a57c3a-0864-409e-ab3b-3e5510d9c8dc',
                url: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/1.json',
              },
              {
                fileName: 'excel.xlsx',
                id: 'rc-upload-1734098585253-15',
                status: 'done',
                percent: 100,
                fileId: 'excelxlsx',
                url: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/excel.xlsx',
              },
              {
                fileName: 'pdf.pdf',
                id: 'rc-upload-1734098585253-16',
                status: 'done',
                percent: 100,
                fileId: 'pdf',
                url: 'https://ims-view-pc-eternallycyfs-projects.vercel.app/pdf.pdf',
              },
            ],
          }}
          formList={[
            {
              type: 'custom',
              label: '上传文件',
              name: 'file',
              col: 24,
              itemProps: {
                rules: FormRules.withName('上传文件').isRequired().create(),
              },
              Component: (props) => {
                return (
                  <FileUpload
                    value={props?.value}
                    onChange={props?.onChange}
                    uploadProps={{
                      customRequest: customRequest,
                    }}
                    colNumber={12}
                    maxCount={5}
                    config={{
                      label: '上传文件',
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
                    }}
                  />
                );
              },
            },
          ]}
        />
      </div>
    </>
  );
};

export default App;

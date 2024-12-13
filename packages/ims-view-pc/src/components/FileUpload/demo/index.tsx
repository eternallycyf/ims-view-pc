import { random } from '@ims-view/utils';
import { Form, type UploadProps } from 'antd';
import { CustomForm, FileUpload, FormRules } from 'ims-view-pc';
import { useRef } from 'react';

interface IFormValues {
  file: any[];
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
      <div style={{ maxWidth: 700 }}>
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
                fileName: '7e7d0d4c-60b9-4d4f-9f94-80a385d471ce.png',
                id: 'rc-upload-1734098585253-8',
                status: 'done',
                percent: 100,
                fileId: '7e7d0d4c-60b9-4d4f-9f94-80a385d471ce',
                uploadDateTime: '2023-04-07T07:06:05.000Z',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              },
              {
                fileName: 'b6bdc21f-6d82-47ed-b329-6d47af66e9af.png',
                id: 'rc-upload-1734098585253-10',
                status: 'done',
                percent: 100,
                fileId: 'b6bdc21f-6d82-47ed-b329-6d47af66e9af',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              },
              {
                fileName: '14a57c3a-0864-409e-ab3b-3e5510d9c8dc.png',
                id: 'rc-upload-1734098585253-12',
                status: 'done',
                percent: 100,
                fileId: '14a57c3a-0864-409e-ab3b-3e5510d9c8dc',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              },
              {
                fileName: '8aeae013-1007-4eaf-83be-7a544f896fe0.png',
                id: 'rc-upload-1734098585253-14',
                status: 'done',
                percent: 100,
                fileId: '8aeae013-1007-4eaf-83be-7a544f896fe0',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
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
                    attachment={{
                      maxCount: 5,
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

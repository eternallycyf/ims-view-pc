import { CommonCard, CommonDescriptions } from 'ims-view-pc';

const IndexPage = () => {
  return (
    <CommonCard.Page>
      <CommonDescriptions<{ activityDesc: number }>
        title="xx"
        extra={[
          {
            type: 'default',
            buttonType: 'primary',
            element: '链接',
            itemProps: {
              buttonProps: {
                size: 'small',
                onClick: (e) => console.log(e),
              },
            },
          },
        ]}
        tooltip="xxxxx"
        columns={[
          {
            label: '姓名',
            type: 'formItem',
            key: 'activityDesc',
            tooltip: '123',
            // isPhone: true,
            // formatTime: {
            //   format: 'YYYY年-MM月',
            //   type: 'YYYY-MM-DD',
            // },
            maxLength: 200,
            dict: [{ text: '实例', value: 2 }],
            controlProps: {},
            span: 12,
          },
          {
            label: '姓名',
            type: 'formItem',
            key: 'activityDesc',
            tooltip: '123',
            // isPhone: true,
            // formatTime: {
            //   format: 'YYYY年-MM月',
            //   type: 'YYYY-MM-DD',
            // },
            maxLength: 200,
            dict: [{ text: '实例', value: 2 }],
            controlProps: {},
            span: 12,
          },
          {
            label: '姓名',
            type: 'formItem',
            key: 'activityDesc',
            tooltip: '123',
            // isPhone: true,
            // formatTime: {
            //   format: 'YYYY年-MM月',
            //   type: 'YYYY-MM-DD',
            // },
            maxLength: 200,
            dict: [{ text: '实例', value: 2 }],
            controlProps: {},
            span: 12,
          },
          {
            label: '姓名',
            type: 'formItem',
            key: 'activityDesc',
            tooltip: '123',
            // isPhone: true,
            // formatTime: {
            //   format: 'YYYY年-MM月',
            //   type: 'YYYY-MM-DD',
            // },
            maxLength: 200,
            dict: [{ text: '实例', value: 2 }],
            controlProps: {},
            span: 12,
          },
        ]}
        dataHandler={(item) => ({
          ...item,
          activityDesc: 2,
        })}
        request={() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  list: [
                    {
                      activityDesc: 1,
                    },
                  ],
                },
              });
            }, 1000);
          });
        }}
        fetchConfig={{
          apiUrl: '/getActivityList',
          params: { kw: '123' },
          data: { record: '123' },
          method: 'get',
          dataPath: 'data.list[0]',
          // depts: [num],
        }}
      />
    </CommonCard.Page>
  );
};

export default IndexPage;

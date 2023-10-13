import { useFetchProps } from '@ims-view/hooks';
import { Button, Spin } from 'antd';
import { CommonDemo, ICommonDemoHandle } from 'ims-view-pc';
import React, { useState } from 'react';

interface IRecord {
  username: string;
  useId: number;
}

interface IApi {
  code: number;
  msg: string;
  success: boolean;
  data: IRecord;
}

const Demo = () => {
  const [number, setNumber] = useState<number>(0);
  const CommonDemoRef = React.useRef<ICommonDemoHandle<IRecord>>(null!);
  const params: useFetchProps<IRecord> = {
    fetchConfig: {
      apiUrl: '/fetchUserInfo',
      method: 'post',
      dataPath: 'data',
      depts: [number],
    },
    request: async (config) => {
      const data = new Promise((resolve, reject) => {
        fetch(config?.url, config as any)
          .then((data) => data.json())
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      });
      return (await data) as IApi;
    },
    // dataHandler: (data) => data?.data,
  };

  const handleFetch = () => {
    setNumber(number + 1);
  };

  return (
    <>
      <CommonDemo<IRecord> ref={CommonDemoRef} {...params}>
        <Spin spinning={CommonDemoRef?.current?.loading || false}>
          <Button onClick={handleFetch}>发起请求</Button>
          <pre>{JSON.stringify(CommonDemoRef?.current?.data)}</pre>
        </Spin>
      </CommonDemo>
    </>
  );
};
export default Demo;

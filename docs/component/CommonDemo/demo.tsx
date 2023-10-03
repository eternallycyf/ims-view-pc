import { useFetchProps, useFetchState } from '@ims-view/hooks';
import { Button, Spin } from 'antd';
import axios from 'axios';
import { CommonDemo, ICommonDemoHandle } from 'ims-view-pc';
import React, { useState } from 'react';

interface IApi {
  code: number;
  msg: string;
  success: boolean;
  data: {
    username: string;
    useId: number;
  };
}

const Demo = () => {
  const [number, setNumber] = useState<number>(0);
  const CommonDemoRef = React.useRef<ICommonDemoHandle<IApi>>(null!);
  const params: useFetchProps = {
    fetchConfig: {
      apiUrl: '/fetchUserInfo',
      method: 'post',
      dataPath: 'data',
      depts: [number],
    },
    request: axios,
    dataHandler: (data) => data?.data,
  };

  const handleFetch = () => {
    setNumber(number + 1);
  };

  return (
    <>
      <CommonDemo<IApi> ref={CommonDemoRef} {...params}>
        <Spin spinning={CommonDemoRef?.current?.loading || false}>
          <Button onClick={handleFetch}>发起请求</Button>
          <pre>{JSON.stringify(CommonDemoRef?.current?.data)}</pre>
        </Spin>
      </CommonDemo>
    </>
  );
};
export default Demo;

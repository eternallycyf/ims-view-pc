import { useFetch, useFetchProps, useFetchState } from '@ims-view/hooks';
import { Button, Spin } from 'antd';
import axios from 'axios';
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

const App = () => {
  const [number, setNumber] = useState<number>(0);
  const [{ value: data = {}, loading }, fetchData] = useFetch<IApi>({
    fetchConfig: {
      apiUrl: '/fetchUserInfo',
      method: 'post',
      dataPath: 'data',
      // when initRequest use true
      // depts: [number],
    },
    request: axios,
    initRequest: false,
    dataHandler: (data) => data?.data,
  });

  const hanldeFetch = () => {
    setNumber(number + 1);
    fetchData();
  };

  return (
    <Spin spinning={loading}>
      <Button onClick={() => hanldeFetch()}>发起请求</Button>
      <pre>{JSON.stringify(data)}</pre>
    </Spin>
  );
};
export default App;

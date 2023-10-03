import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { useAsyncFn } from 'react-use';
import { useFetchProps, useFetchState } from './interface';

export default function useFetch<T>(props: useFetchProps<T>): useFetchState<T> {
  const { fetchConfig, dataHandler, initRequest = true, request } = props;
  const [data, fetchData] = useAsyncFn(async (defaultParams?, defaultData?) => {
    try {
      const response = await request({
        url: fetchConfig?.apiUrl,
        method: fetchConfig?.method || 'get',
        params: defaultParams || fetchConfig?.params,
        data: defaultData || fetchConfig?.data,
      });
      const data = _.get(response, fetchConfig?.dataPath || 'data.data');
      if (dataHandler) return dataHandler(data);
      return data || {};
    } catch (error) {
      console.log(error);
    }
  }, fetchConfig?.depts || []);

  useEffect(() => {
    initRequest && fetchData();
  }, fetchConfig?.depts || []);

  return [data, fetchData] as useFetchState<T>;
}

import { render } from '@testing-library/react';
import axios from 'axios';
import { CommonDemo } from 'ims-view-pc';
import React from 'react';

test('CommonDemo', () => {
  const props = {
    fetchConfig: {
      apiUrl: '/fetchUserInfo',
      method: 'post' as 'post',
      dataPath: 'data',
    },
    request: axios,
    initRequest: false,
    dataHandler: (data) => data?.data,
  };
  const { container } = render(<CommonDemo {...props} />);

  expect(container).toMatchSnapshot();
});

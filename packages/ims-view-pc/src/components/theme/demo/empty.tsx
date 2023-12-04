import { Space } from 'antd';
import { Theme } from 'ims-view-pc';

const Demo = () => {
  return (
    <Space>
      <Theme.Empty.Search />
      <Theme.Empty.Doc />
      <Theme.Empty.Upload />
    </Space>
  );
};

export default Demo;

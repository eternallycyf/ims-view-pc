import { Space } from 'antd';
import { CustomTag } from 'ims-view-pc';

const Demo = () => {
  return (
    <Space direction="vertical">
      {Array.from({ length: 10 }).map((ele, index) => (
        <CustomTag
          key={index}
          label={`标签-${'测试'.repeat(index + 1)}`}
          tooltip="提示"
          style={{ maxWidth: 120 }}
        />
      ))}
    </Space>
  );
};

export default Demo;

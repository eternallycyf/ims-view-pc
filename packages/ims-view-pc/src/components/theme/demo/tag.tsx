import { Space } from 'antd';
import { Theme } from 'ims-view-pc';

const dict = [
  {
    label: '发起',
    value: 'blue',
  },
  {
    label: '待审批',
    value: 'orange',
  },
  {
    label: '成功',
    value: 'green',
  },
  {
    label: '失败',
    value: 'red',
  },
  {
    label: 'purple',
    value: 'purple',
  },
  {
    label: '已结束',
    value: 'grey',
  },
];

const Demo = () => {
  return (
    <Space direction="horizontal">
      {dict.map((item, index) => (
        <Theme.Tag key={index} color={item.value}>
          {item?.label ?? '--'}
        </Theme.Tag>
      ))}
    </Space>
  );
};

export default Demo;

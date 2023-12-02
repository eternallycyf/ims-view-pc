import { Space } from 'antd';
import { Theme } from 'ims-view-pc';

const dict = [
  {
    label: '发起、配置中',
    value: 'start',
  },
  {
    label: '待审批、待考核、待认证',
    value: 'approve',
  },
  {
    label: '成功、通过、完成、启用、开通、',
    value: 'success',
  },
  {
    label: '已结束、已废止、过期、失效',
    value: 'finish',
  },
  {
    label: '失败、不通过、已驳回、否决',
    value: 'error',
  },
  {
    label: '草稿中',
    value: 'draft',
  },
];

const Demo = () => {
  return (
    <Space direction="vertical">
      {dict.map((item) => (
        <Theme.Badge key={item.value} color={item.value} text={item.label} />
      ))}
      <Theme.Badge
        isTable
        color="success"
        text={'表格内使用（避免与可点击文字引起误解，统一使用中性颜色'}
      />
    </Space>
  );
};

export default Demo;

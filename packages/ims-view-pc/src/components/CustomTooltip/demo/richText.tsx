import { Tag } from 'antd';
import { CustomTooltip } from 'ims-view-pc';

const Demo = () => {
  return (
    <>
      前面
      <CustomTooltip.RichText
        html={'22'.repeat(42) + '<a href="https://www.baidu.com">测试不知道</a>'}
      />
      后面
    </>
  );
};

export default Demo;

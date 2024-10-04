import { CustomTooltip } from 'ims-view-pc';

const Demo = () => {
  return (
    <div>
      <h1>1.string</h1>
      <h3>单行</h3>
      <CustomTooltip rows={1} content={'测试'.repeat(200)} />
      <h3>多行</h3>
      <CustomTooltip rows={2} content={'测试'.repeat(200)} />
      <h3>可展开-默认</h3>
      <CustomTooltip direction="default" expand rows={2} content={'测试'.repeat(200)} />
      <h3>可展开-右侧</h3>
      <CustomTooltip direction="right" expand rows={2} content={'测试'.repeat(200)} />
      <h3>可展开按钮风格-simple</h3>
      <CustomTooltip type="simple" direction="right" expand rows={2} content={'测试'.repeat(200)} />
    </div>
  );
};

export default Demo;

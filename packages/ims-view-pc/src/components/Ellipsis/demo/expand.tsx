import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import { Ellipsis } from 'ims-view-pc';

const App = () => {
  const content =
    '蚂蚁集团的企业级产品是一个庞大且复杂的系统，数量多且功能复杂，而且变动和并发频繁，常常需要设计者与开发者能快速做出响应。同时这类产品中有存在很多类似的页面以及组件，可以通过抽象得到一些稳定且高复用性的内容。随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。带着这样的一个终极目标，我们（蚂蚁集团体验技术部）经过大量项目实践和总结，逐步打磨出一个服务于企业级产品的设计体系 —— Ant Design。基于「自然」、「确定性」、「意义感」、「生长性」四大设计价值观，通过模块化解决方案，降低冗余的生产成本，让设计者专注于更好的用户体验';

  return (
    <>
      <Card title="尾部省略">
        <Ellipsis.Expand direction="end" tooltip content={content} />
      </Card>

      <Card title="头部省略">
        <Ellipsis.Expand direction="start" content={content} />
      </Card>

      <Card title="中间省略">
        <Ellipsis.Expand direction="middle" content={content} />
      </Card>

      <Card title="多行省略">
        <Ellipsis.Expand direction="end" rows={3} content={content} />
      </Card>

      <Card title="展开收起">
        <Ellipsis.Expand direction="end" content={content} expandText="展开" collapseText="收起" />
      </Card>

      <Card title="仅展开">
        <Space direction="vertical">
          <Ellipsis.Expand direction="end" content={content} expandText="展开" />
          <Ellipsis.Expand direction="start" content={content} expandText="展开" />
          <Ellipsis.Expand direction="middle" content={content} expandText="展开" />
        </Space>
      </Card>

      <Card title="默认展开">
        <Ellipsis.Expand
          content={content}
          defaultExpanded={true}
          expandText="展开"
          collapseText="收起"
        />
      </Card>

      <Card title="emoji">
        <Ellipsis.Expand
          direction="end"
          content={'🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉'}
          expandText="展开"
          collapseText="收起"
        />
      </Card>
      <Card title="这是一个使用icon的例子">
        <Ellipsis.Expand
          direction="end"
          content={content}
          expandText={
            <>
              展开
              <DownOutlined />
            </>
          }
          collapseText={
            <>
              收起
              <UpOutlined />
            </>
          }
        />
      </Card>
    </>
  );
};

export default App;

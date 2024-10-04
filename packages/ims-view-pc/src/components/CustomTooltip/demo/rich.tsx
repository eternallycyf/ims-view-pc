import { Tag } from 'antd';
import { CustomTooltip } from 'ims-view-pc';
import { Fragment } from 'react';

const Demo = () => {
  const arr = Array.from({ length: 8 }, (v, i) => <div key={i}>string</div>);

  const list = Array.from({ length: 15 });
  const tagS = list.map((_, i) => (
    <Tag key={Math.random()} style={{ marginBottom: 5 }} color="blue">
      这是一个tag
    </Tag>
  ));

  return (
    <div>
      <h1>2.富文本</h1>
      <h3>独占一行</h3>
      <CustomTooltip
        // ellipsisProps={{ tooltip: false }}
        expand
        direction="right"
        ellipsisSymbol={false}
        content={Array.from({ length: 20 }, (v, i) => (
          <div key={i}>string</div>
        ))}
      />
      <h3>独占一行-展开具体数量</h3>
      <CustomTooltip
        // ellipsisProps={{ tooltip: false }}
        ellipsisSymbol={false}
        content={arr}
        rows={2}
        expand
        type="simple"
        expandMoreLength={arr?.length - 2}
      />
      <h3>tags</h3>
      <CustomTooltip
        // ellipsisProps={{ tooltip: false }}
        direction="right"
        ellipsisSymbol={false}
        content={tagS}
        rows={1}
        expand
      />
    </div>
  );
};

export default Demo;

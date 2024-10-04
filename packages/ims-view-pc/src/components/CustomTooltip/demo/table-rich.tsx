import { Table, Tag } from 'antd';
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
      <Table
        dataSource={[{}, {}, {}]}
        pagination={false}
        columns={[
          {
            title: '单行富文本',
            width: 100,
            render: () => (
              <CustomTooltip
                // ellipsisProps={{ tooltip: false }}
                expand
                direction="right"
                ellipsisSymbol={false}
                content={Array.from({ length: 20 }, (v, i) => (
                  <div key={i}>string</div>
                ))}
              />
            ),
          },
          {
            title: '可展开-具体数量',
            width: 100,
            render: () => (
              <CustomTooltip
                // ellipsisProps={{ tooltip: false }}
                ellipsisSymbol={false}
                content={arr}
                rows={2}
                expand
                type="simple"
                expandMoreLength={arr?.length - 2}
              />
            ),
          },
          {
            title: '可展开-右侧',
            width: 100,
            render: () => (
              <CustomTooltip
                // ellipsisProps={{ tooltip: false }}
                direction="right"
                ellipsisSymbol={false}
                content={tagS}
                rows={2}
                expand
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Demo;

import { Table, Tag } from 'antd';
import { CustomTooltip } from 'ims-view-pc';
import { Fragment } from 'react';

const Demo = () => {
  return (
    <div>
      <Table
        dataSource={[{}, {}, {}]}
        pagination={false}
        scroll={{ x: 'max-content' }}
        columns={[
          {
            title: 'string',
            width: 180,
            render: () => <CustomTooltip rows={2} content={'测试'.repeat(200)} />,
          },
          {
            title: '可展开',
            width: 180,
            render: () => (
              <CustomTooltip direction="default" expand rows={2} content={'测试'.repeat(200)} />
            ),
          },
          {
            title: '可展开-右侧',
            width: 180,
            render: () => (
              <CustomTooltip direction="right" expand rows={2} content={'测试'.repeat(200)} />
            ),
          },
          {
            title: '可展开-simple',
            width: 180,
            render: () => (
              <CustomTooltip
                type="simple"
                direction="right"
                expand
                rows={2}
                content={'测试'.repeat(200)}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Demo;

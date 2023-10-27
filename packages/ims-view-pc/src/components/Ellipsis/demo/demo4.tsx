import { Tag } from 'antd';
import { Ellipsis } from 'ims-view-pc';
import React from 'react';
export default () => {
  const article =
    'There were injuries alleged in three cases in 2015, and a fourth incident in September, according to the safety recall report. After meeting with US regulators in October, the firm decided to issue a voluntary recall.';
  return (
    <span style={{ display: 'flex' }}>
      <Tag>这是tag</Tag>
      <Ellipsis lines={1} style={{ flex: 1 }}>
        {article ?? '--'}
      </Ellipsis>
    </span>
  );
};

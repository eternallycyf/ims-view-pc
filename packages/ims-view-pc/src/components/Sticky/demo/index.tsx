import { Button } from 'antd';
import { Sticky } from 'ims-view-pc';
import React, { useRef } from 'react';
import './index.less';

export default () => {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="demo-sticky--wrapper">
        <Sticky>
          <Button type="primary" style={{ marginLeft: '15px' }}>
            基础用法
          </Button>
        </Sticky>

        <Sticky offsetTop={50}>
          <Button style={{ marginLeft: '115px' }}>吸顶距离</Button>
        </Sticky>

        <div ref={container} style={{ height: '300px', backgroundColor: '#fff' }}>
          <Sticky container={container}>
            <Button style={{ marginLeft: '215px' }}>指定容器</Button>
          </Sticky>
        </div>

        <div style={{ height: '70vh' }} />
        <Sticky position="bottom" offsetBottom={50}>
          <Button style={{ marginLeft: '15px' }}>吸底距离</Button>
        </Sticky>
      </div>
    </div>
  );
};

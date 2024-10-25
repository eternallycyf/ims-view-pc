import { Tabs, TabsProps } from 'antd';
import { GraphChart } from 'ims-view-pc';
import React from 'react';
import data1 from './config/data1.json';
import data2 from './config/data2.json';

const IndexPage = () => {
  const getInitData = (type: '1' | '2' = '1') => {
    let data = type === '1' ? data1.data : data2.data;
    return JSON.parse(JSON.stringify(data).replace(/"content"/g, '"name"'));
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: <GraphChart key="1" chartType={'1'} data={getInitData('1')} />,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <GraphChart key="2" chartType={'2'} data={getInitData('2')} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} destroyInactiveTabPane />
    </div>
  );
};

export default IndexPage;

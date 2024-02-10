import { CommonCard, ICommonCardIndexPageProps } from 'ims-view-pc';
import React from 'react';

const IndexPage = () => {
  const [activeKey, setActiveKey] = React.useState<string>('index');

  const tabList: ICommonCardIndexPageProps['tabList'] = [
    {
      label: '概览',
      key: 'index',
      visible: true,
      children: <div style={{ height: 500 }}>sticky</div>,
    },
  ];

  return (
    <div>
      <CommonCard.StickyPage
        header={'这是头部'}
        tabList={tabList}
        loading={false}
        style={{ height: '100vh', overflow: 'auto' }}
        tabProps={{
          activeKey,
          onChange: setActiveKey,
        }}
      ></CommonCard.StickyPage>
    </div>
  );
};

export default IndexPage;

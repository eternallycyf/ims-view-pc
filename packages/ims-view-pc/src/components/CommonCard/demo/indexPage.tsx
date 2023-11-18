import { CommonCard, ICommonCardIndexPageProps } from 'ims-view-pc';
import React from 'react';
import Overview from './overview';

const IndexPage = () => {
  const [activeKey, setActiveKey] = React.useState<string>('overview');

  const componentProps = { title: 'overview' };
  const tabList: ICommonCardIndexPageProps['tabList'] = [
    {
      label: '概览',
      key: 'overview',
      visible: true,
      children: <Overview {...componentProps} />,
    },
  ];

  return (
    <CommonCard.IndexPage
      header={'这是头部'}
      tabList={tabList}
      loading={false}
      style={{ height: '100vh' }}
      tabProps={{
        activeKey,
        onChange: setActiveKey,
      }}
    />
  );
};

export default IndexPage;

import { Spin, Tabs } from 'antd';
import React, { Component } from 'react';
import { variables as defaultVariables } from '../../styles/variables';
import './index.less';
import { ICommonCardIndexPageProps } from './interface';

function IndexPage<Values = any>(props: ICommonCardIndexPageProps<Values>): React.ReactElement {
  const { loading = false, header, tabProps, tabList = [], children } = props;

  const variables = {
    '--primary-bg-color': defaultVariables.colorPrimaryBg,
    '--primary-color': defaultVariables.colorPrimary,
    '--primary-color-hover': defaultVariables.colorPrimaryHover,
    '--primary-color-active': defaultVariables.colorPrimaryActive,
  };

  return (
    <div className="IndexPage" style={variables}>
      <Spin wrapperClassName="spin" spinning={loading}>
        <div className="wrapper">
          <div className="header">
            <div className="headerCard">{header}</div>
            <div className="spaceLine" />
          </div>
          <div className="content">
            {tabList && tabList?.length !== 0 && (
              <Tabs
                className="tabs"
                items={tabList.filter((item) => item.visible ?? true)}
                {...tabProps}
              />
            )}
            {children}
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default IndexPage;

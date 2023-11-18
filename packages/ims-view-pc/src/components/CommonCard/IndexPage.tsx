import { Spin, Tabs } from 'antd';
import { variables as defaultVariables } from 'ims-view-pc';
import React, { Component } from 'react';
import './index.less';
import { ICommonCardIndexPageProps } from './interface';

function IndexPage<Values = any>(props: ICommonCardIndexPageProps<Values>): React.ReactElement {
  const { loading = false, header, tabProps, tabList = [], children, style } = props;

  const variables = {
    '--primary-bg-color': defaultVariables.colorPrimaryBg,
    '--primary-color': defaultVariables.colorPrimary,
    '--primary-color-hover': defaultVariables.colorPrimaryHover,
    '--primary-color-active': defaultVariables.colorPrimaryActive,
    ...style,
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

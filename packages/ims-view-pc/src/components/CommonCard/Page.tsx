import { Spin } from 'antd';
import { SectionTitle } from 'ims-view-pc';
import React from 'react';
import './index.less';
import { IPageProps } from './interface';

const Page: React.FC<IPageProps> = (props) => {
  const { children, className, loading, title, sectionTitleProps, ...restProps } = props;

  return (
    <div className={`page ${className}`} {...restProps}>
      <div>
        <SectionTitle title={title} {...sectionTitleProps}>
          {loading ? (
            <div className="loading">
              <Spin tip="加裁中..." />
            </div>
          ) : (
            <div className="page-content">{children}</div>
          )}
        </SectionTitle>
      </div>
    </div>
  );
};

Page.defaultProps = {
  loading: false,
};

export default React.memo(Page);

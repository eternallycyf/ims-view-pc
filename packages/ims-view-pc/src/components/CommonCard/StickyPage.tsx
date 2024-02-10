import { Spin, Tabs } from 'antd';
import { AnyData, variables as defaultVariables } from 'ims-view-pc';
import './index.less';
import { IStickyPageProps } from './interface';

function StickyPage(props: IStickyPageProps): React.ReactElement {
  const { loading = false, header, tabProps, tabList = [], style, className, children } = props;
  const tabClassName = tabProps?.type === 'editable-card' ? 'newBtnTbas' : '';
  const { activeKey } = tabProps;

  const variables = {
    '--primary-bg-color': defaultVariables.colorPrimaryBg,
    '--primary-color': defaultVariables.colorPrimary,
    '--primary-color-hover': defaultVariables.colorPrimaryHover,
    '--primary-color-active': defaultVariables.colorPrimaryActive,
    ...style,
  };

  return (
    <>
      <div className={`StickyPage ${className}`} style={variables}>
        <Spin spinning={loading}>
          <div className="wrapper">
            <div className="header">{header}</div>

            <div className={`StickyContent`}>
              {tabList && tabList?.length !== 0 && (
                <Tabs className={`tabs ${tabClassName}`} {...tabProps}>
                  {tabList.map(({ tabKey, key, visible = true, label, ...rest }) => {
                    if (!visible) return null;
                    return <Tabs.TabPane tab={label} key={key} closable={false}></Tabs.TabPane>;
                  })}
                </Tabs>
              )}
            </div>

            {children}
            <div className="content">
              {tabList &&
                tabList?.length !== 0 &&
                tabList
                  .filter(({ tabKey, key, children, visible, ...rest }) => {
                    if (activeKey === key) return true;
                    return false;
                  })
                  .map(({ tabKey, key, children, visible, ...rest }) => {
                    return (
                      <div key={key} className="tabContentCard" style={rest?.style}>
                        {children}
                      </div>
                    );
                  })}
            </div>
          </div>
        </Spin>
      </div>
    </>
  );
}

export default StickyPage;

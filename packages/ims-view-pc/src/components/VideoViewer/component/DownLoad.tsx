import { DownloadOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import React, { Component } from 'react';

interface DownLoadProps {
  prefixCls?: string;
  vjsComponent: any;
}

export default class DownLoad extends Component<DownLoadProps, any> {
  static defaultProps = {
    prefixCls: 'fishd-video-viewer-download',
  };

  render() {
    const { vjsComponent, prefixCls } = this.props;
    const src = vjsComponent.options_.playerOptions.downloadSrc;
    return (
      <div className="VideoViewer">
        <div className={classnames(prefixCls, 'fishd-video-js-customer-button')}>
          <Tooltip
            title={<span style={{ wordBreak: 'keep-all' }}>下载</span>}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <a download href={src} target="_blank" rel="noopener noreferrer">
              <DownloadOutlined />
            </a>
          </Tooltip>
        </div>
      </div>
    );
  }
}

import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import React, { Component } from 'react';
import type { VideoJsPlayer } from 'video.js';

interface FullScreenProps {
  prefixCls?: string;
  vjsComponent: any;
}

interface FullScreenState {
  isFullScreen: boolean;
}

export default class FullScreen extends Component<FullScreenProps, FullScreenState> {
  static defaultProps = {
    prefixCls: 'fishd-video-viewer-fullscreen',
  };

  public player: VideoJsPlayer;

  constructor(props: FullScreenProps) {
    super(props);

    // 获取播放器实例
    this.player = props.vjsComponent.player_;

    this.state = {
      isFullScreen: this.player.isFullscreen(),
    };
  }

  componentDidMount() {
    this.player.on('fullscreenchange', this.setFullScreen);
  }

  componentWillUnmount() {
    this.player.off('fullscreenchange', this.setFullScreen);
  }

  setFullScreen = () => {
    this.setState({
      isFullScreen: this.player.isFullscreen(),
    });
  };

  handleClick = () => {
    const { isFullScreen } = this.state;

    if (!isFullScreen) {
      this.player.requestFullscreen();
    } else {
      this.player.exitFullscreen();
    }

    this.setState({
      isFullScreen: !isFullScreen,
    });
  };

  render() {
    const { prefixCls } = this.props;
    const { isFullScreen } = this.state;

    return (
      <div className="VideoViewer">
        <div
          className={classnames(prefixCls, 'fishd-video-js-customer-button')}
          onClick={() => this.handleClick()}
        >
          <Tooltip
            title={
              <span style={{ wordBreak: 'keep-all' }}>{!isFullScreen ? '全屏' : '退出全屏'}</span>
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <a>{!isFullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}</a>
          </Tooltip>
        </div>
      </div>
    );
  }
}

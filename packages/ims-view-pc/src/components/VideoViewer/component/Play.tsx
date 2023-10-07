import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import React, { Component } from 'react';
import type { VideoJsPlayer } from 'video.js';

interface PlayProps {
  prefixCls?: string;
  vjsComponent: any;
}

interface PlayState {
  isPlay: boolean;
}

export default class Play extends Component<PlayProps, PlayState> {
  static defaultProps = {
    prefixCls: 'fishd-video-viewer-play',
  };

  public player: VideoJsPlayer;

  constructor(props: PlayProps) {
    super(props);

    // 获取播放器实例
    this.player = props.vjsComponent.player_;

    this.state = {
      isPlay: false,
    };
  }

  componentDidMount() {
    this.player.on('play', this.setPlay(true));
    this.player.on('pause', this.setPlay(false));
    this.player.on('ended', this.setPlay(false));
  }

  componentWillUnmount() {
    this.player.off('play', this.setPlay(true));
    this.player.off('pause', this.setPlay(false));
    this.player.off('ended', this.setPlay(false));
  }

  handleClick = () => {
    const { isPlay } = this.state;

    if (!isPlay) {
      this.player.play();
    } else {
      this.player.pause();
    }

    this.setState({
      isPlay: !isPlay,
    });
  };

  setPlay = (isPlay: boolean) => {
    return () => {
      this.setState({
        isPlay: isPlay,
      });
    };
  };

  render() {
    const { prefixCls } = this.props;
    const { isPlay } = this.state;

    return (
      <div
        className={classnames(prefixCls, 'fishd-video-js-customer-button')}
        onClick={() => this.handleClick()}
      >
        <a>
          {!isPlay ? (
            <CaretRightOutlined className="handle-audio-icon pause-play" />
          ) : (
            <PauseOutlined className="handle-audio-icon pause-play" />
          )}
        </a>
      </div>
    );
  }
}

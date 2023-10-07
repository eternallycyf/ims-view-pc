import * as React from 'react';
import videojs from 'video.js';
import './component/vjsDownLoad';
import './component/vjsErrorDisplay';
import './component/vjsFullScreen';
import './component/vjsPlay';
import './component/vjsVolume';
import { VideoViewerProps } from './interface';
import { zh_CN } from './lang/zh-CN';
import KEYCODE from './utils';

videojs.addLanguage('zh-CN', zh_CN);

export default class VideoViewer extends React.Component<VideoViewerProps> {
  static defaultProps = {
    prefixCls: 'fishd-video-js',
    className: 'video-js',
    width: 640, // 视频容器的宽度
    height: 360, // 视频容器的高度
    poster: '', // 播放前显示的视频画面，播放开始之后自动移除。通常传入一个URL
    sources: [], // 资源文件
    autoplay: false, // 播放器准备好之后，是否自动播放
    loop: false, // 视频播放结束后，是否循环播放
    muted: false, // 是否静音
    preload: 'auto', // 预加载('auto' 自动 ’metadata' 元数据信息 ，比如视频长度，尺寸等 'none'  不预加载任何数据，直到用户开始播放才开始下载)
    controls: true, // 是否显示控制条
    download: false, // 是否显示下载按钮
    bigPlayButton: true, // 是否显示大按钮
    keepFocus: true, // 是否自动聚焦
  };

  player: any;

  videoNode: HTMLVideoElement | undefined;

  videoPlayerRef: HTMLDivElement | undefined;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: VideoViewerProps) {
    super(props);
  }

  componentDidMount() {
    const { download, bigPlayButton, keepFocus, ...otherProps } = this.props;

    const initOptions = {
      //aspectRatio: '16:9',
      //autoSetup: false,
      //fluid: true,
      //inactivityTimeout: 3000,
      //liveui: true,
      //notSupportedMessage: '',
      //responsive: true,
      loadingSpinner: true,
      bigPlayButton: bigPlayButton,
      controlBar: {
        children: [
          {
            name: 'progressControl',
          },
          {
            name: 'vjsPlay',
          },
          {
            name: 'currentTimeDisplay',
          },
          {
            name: 'timeDivider',
          },
          {
            name: 'durationDisplay',
          },
          {
            name: 'vjsFullScreen',
          },
          {
            name: download ? 'vjsDownLoad' : '',
          },
          {
            name: 'vjsVolume',
          },
        ],
      },
      errorDisplay: {
        children: [
          {
            name: 'vjsErrorDisplay',
          },
        ],
      },
    };

    const option = Object.assign({}, initOptions, otherProps) as any;

    // instantiate video.js
    this.player = videojs(this.videoNode!, option, () => {
      if (keepFocus) {
        this.player.on('timeupdate', () => {
          // 控制焦点
          this.videoPlayerRef!.focus();
        });
      }
      this.player.on('ended', () => {
        setTimeout(() => {
          this.player?.controlBar?.progressControl?.seekBar?.update?.();
        }, 50);
      });
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  getVideoPlayer = () => {
    return this.player;
  };

  // 空格键控制 暂停、播放
  handleSpaceKeyDown = (e: any) => {
    if (e.which === KEYCODE.SPACE) {
      e.preventDefault();
      if (this.player) {
        if (this.player.paused()) {
          this.player.play();
        } else {
          this.player.pause();
        }
      }
    }
  };

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/ video.js /pull/3856
  render() {
    const { prefixCls, className } = this.props;

    return (
      <div className={`${prefixCls}-wrap`}>
        <div
          data-vjs-player
          ref={(node) => ((this.videoPlayerRef as any) = node)}
          onKeyDown={this.handleSpaceKeyDown}
        >
          <video ref={(node) => ((this.videoNode as any) = node)} className={className} />
        </div>
      </div>
    );
  }
}

import { PlayCircleFilled } from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import * as React from 'react';
import { VideoViewerProps, VideoViewerState } from './interface';
import Video from './Video';
import VideoModal from './VideoModal';

class VideoViewer extends React.Component<VideoViewerProps, VideoViewerState> {
  static defaultProps = {
    prefixCls: 'fishd-video-viewer',
    poster: null,
    width: 240,
    height: 135,
    failedMessage: null,
  };

  video: React.RefObject<any>;

  static Video = Video;

  static VideoModal = VideoModal;

  constructor(props: VideoViewerProps) {
    super(props);
    this.state = {
      videoModalVisible: false,
    };
    this.video = React.createRef<Video>();
  }

  // 点击缩略图
  handleThumbClick = (e: any) => {
    if (this.props.failedMessage !== null) return;

    this.setState(
      {
        videoModalVisible: true,
      },
      () => {
        const video = this.video && this.video.current;
        const player = video && video.getVideoPlayer();
        if (player && typeof player.play === 'function') {
          player.play();
        }
      },
    );
    this.props.onThumbClick && this.props.onThumbClick(e);
  };

  // 模态框关闭的回调
  onClose = () => {
    const video = this.video && this.video.current;
    const player = video && video.getVideoPlayer();
    if (player && typeof player.pause === 'function') {
      player.pause();
    }
    this.props.modalProps!.afterClose && this.props.modalProps!.afterClose();
  };

  // 点击模态框关闭按钮
  handleCancel = () => {
    this.setState({
      videoModalVisible: false,
    });
    this.props.modalProps!.onCancel && this.props.modalProps!.onCancel();
  };

  render() {
    const { videoModalVisible } = this.state;
    const { prefixCls, width, height, poster, modalProps, videoProps, failedMessage } = this.props;

    const otherModalProps = _.omit(modalProps, ['open', 'afterClose', 'onCancel']);

    const otherVideoProps = _.omit(videoProps, ['autoPlay']);

    const thumbCls = classnames({
      [`${prefixCls}-thumb`]: true,
      [`${prefixCls}-thumb-disabled`]: failedMessage !== null,
    });

    const wrapStyle = { width, height };

    return (
      <div className={`${prefixCls}-wrap`} style={wrapStyle}>
        <div className={thumbCls} onClick={this.handleThumbClick}>
          {failedMessage === null ? (
            <div
              className={classnames([
                `${prefixCls}-thumb-status`,
                `${prefixCls}-thumb-big-play-button`,
              ])}
            >
              <PlayCircleFilled />
            </div>
          ) : (
            <div
              className={classnames([
                `${prefixCls}-thumb-status`,
                `${prefixCls}-thumb-failed-message`,
              ])}
            >
              <span>{failedMessage}</span>
            </div>
          )}
          <Video
            width={width}
            height={height}
            poster={poster}
            sources={otherVideoProps?.sources}
            controls={false}
          />
        </div>
        <VideoModal
          {...otherModalProps}
          open={videoModalVisible}
          afterClose={this.onClose}
          onCancel={this.handleCancel}
        >
          <Video {...otherVideoProps} ref={this.video} autoplay={true} bigPlayButton={false} />
        </VideoModal>
      </div>
    );
  }
}

export default VideoViewer;

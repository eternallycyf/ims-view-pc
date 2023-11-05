import { Button } from 'antd';
import { VideoViewer } from 'ims-view-pc';
import React from 'react';
import './custom.less';

interface IState {
  open: boolean;
}

export default class Custom extends React.Component<any, IState> {
  video: React.RefObject<InstanceType<typeof VideoViewer.Video>>;
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.video = React.createRef();
  }

  open = () => {
    this.setState(
      {
        open: true,
      },
      () => {
        const video = this.video && this.video.current;
        const player = video && video.getVideoPlayer();
        if (player && typeof player.play === 'function') {
          player.play();
        }
      },
    );
  };

  onClose = () => {
    const video = this.video && this.video.current;
    const player = video.getVideoPlayer();
    if (player && typeof player.paused === 'function') {
      player.pause();
    }
  };

  handleCancel = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div className="source">
        <div className="block">
          <Button type="primary" onClick={this.open}>
            点击播放视频
          </Button>
          <VideoViewer.VideoModal
            mask={true}
            draggable={true}
            maskClosable={false}
            open={this.state.open}
            afterClose={this.onClose}
            onCancel={this.handleCancel}
            width={600}
          >
            <VideoViewer.Video
              ref={this.video}
              autoplay={true}
              bigPlayButton={false}
              sources={[
                {
                  src: 'http://vjs.zencdn.net/v/oceans.mp4',
                  type: 'video/mp4',
                },
              ]}
              width={600}
            />
          </VideoViewer.VideoModal>
        </div>
      </div>
    );
  }
}

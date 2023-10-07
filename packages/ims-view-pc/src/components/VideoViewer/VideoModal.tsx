import { CloseCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { VideoModalProps } from './interface';

class VideoModal extends React.Component<VideoModalProps> {
  static defaultProps = {
    prefixCls: 'fishd-video-modal',
    visible: false,
    draggable: false,
    closable: true,
    mask: false,
    width: 640,
  };

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: VideoModalProps) {
    super(props);
  }

  handleOnClose = () => {
    this.props.onCancel && this.props.onCancel();
  };

  render() {
    const { prefixCls, children, closable, wrapClassName = '', maskStyle } = this.props;

    const MODAL_WRAP = `${prefixCls}-modal-wrap`;

    const otherProps = _.omit(this.props, [
      'prefixCls',
      'wrapClassName',
      'title',
      'footer',
      'maskStyle',
      'closable',
    ]);

    const modalProps = {
      ...otherProps,
      wrapClassName: `${wrapClassName} ${MODAL_WRAP}`,
      className: 'fishd-modal',
      maskStyle: maskStyle ? maskStyle : { backgroundColor: 'rgba(0,0,0,0.2)' },
      // 不显示Modal自带的关闭按钮
      closable: false,
      title: null,
      footer: null,
    };

    const content = (
      <div className={`${prefixCls}-content`}>
        {children}
        <div className={`${prefixCls}-header`}>
          {closable ? (
            <CloseCircleFilled className="icon-close" onClick={this.handleOnClose} />
          ) : null}
        </div>
      </div>
    );

    return (
      <Modal {...modalProps}>
        <div className={`${prefixCls}-inner`}>{content}</div>
      </Modal>
    );
  }
}

export default VideoModal;

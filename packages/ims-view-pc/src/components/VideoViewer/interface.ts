import { ModalProps } from 'antd';
export { type VideoJsPlayer } from 'video.js';

export interface VideoViewerProps {
  prefixCls?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  poster?: string;
  sources?: any[];
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'none' | 'metadata';
  controls?: boolean;
  download?: boolean;
  downloadSrc?: string;
  bigPlayButton?: boolean;
  keepFocus?: boolean;
}

export interface VideoModalProps extends ModalProps {
  prefixCls?: string;
  width?: string | number;
  afterClose?: () => void;
  draggable?: boolean;
  mask?: boolean;
  onCancel?: () => void;
  visible?: boolean;
  children?: React.ReactNode;
  wrapClassName?: string;
  maskStyle?: React.CSSProperties;
  closable?: boolean;
  sources?: any[];
  download?: boolean;
  downloadSrc?: string;
}

export interface VideoViewerProps {
  prefixCls?: string;
  width?: string | number;
  height?: string | number;
  poster?: string;
  failedMessage?: string;
  onThumbClick?: (e: React.MouseEvent) => void;
  modalProps?: VideoModalProps;
  videoProps?: VideoModalProps;
}

export interface VideoViewerState {
  videoModalVisible: boolean;
}

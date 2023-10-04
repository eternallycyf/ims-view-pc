export interface AudioPlayerProps {
  prefixCls?: string;

  className?: string;
  controlVolume?: boolean;
  controlProgress?: boolean;
  displayTime?: boolean;
  download?: boolean;
  src: string;
  title?: string;
  size?: 'default' | 'small';

  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  volume?: number;
  rateOptions?: {
    value?: number;
    suffix?: string;
    decimal?: number;
    range?: number[];
  };
  onAbort?: () => void;
  onCanPlay?: () => void;
  onCanPlayThrough?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onLoadedMetadata?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onSeeked?: () => void;
}

export interface AudioPlayerState {
  isPlay: boolean;
  isMuted: boolean;
  currentVolume: number;
  volumeOpen: boolean;
  rateOpen: boolean;
  allTime: number;
  currentTime: number | undefined;
  disabled: boolean;
  rate: number;
}

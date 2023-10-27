import {
  AudioMutedOutlined,
  CaretRightOutlined,
  DownloadOutlined,
  PauseOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Popover, Slider } from 'antd';
import classNames from 'classnames';
import { variables } from 'ims-view-pc';
import React, { useImperativeHandle } from 'react';
import './index.less';
import { AudioPlayerProps } from './interface';

const InternalAudioPlayer: React.ForwardRefRenderFunction<unknown, AudioPlayerProps> = (
  props,
  ref,
) => {
  const {
    prefixCls,
    title,
    src,
    autoPlay,
    className,
    size,
    loop,
    preload,
    controlVolume,
    controlProgress,
    displayTime,
    download,
    rateOptions,
    onCanPlay,
    onLoadedMetadata,
    onCanPlayThrough,
    onAbort,
    onEnded,
    onError,
    onPause,
    onPlay,
    onSeeked,
    ...otherProps
  } = props;

  const [isPlay, setIsPlay] = React.useState<boolean>();
  const [isMuted, setIsMuted] = React.useState<boolean>();
  const [currentVolume, setCurrentVolume] = React.useState<number>(
    parseInt(String((props.volume || 0) * 100)),
  );
  const [volumeOpen, setVolumeOpen] = React.useState<boolean>(false);
  const [rateOpen, setRateOpen] = React.useState<boolean>(false);
  const [allTime, setAllTime] = React.useState<number>(0);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [disabled, setDisabled] = React.useState<boolean>(!src);
  const [rate, setRate] = React.useState<number>(rateOptions?.value || 1);

  const audioInstance = React.useRef<HTMLAudioElement>(null!);

  useImperativeHandle(ref, () => {
    return {
      audioInstance: audioInstance.current,
    };
  });

  const controlAudio = (type: string, value?: number) => {
    const audio = audioInstance.current;
    const numberValue = Number(value);
    switch (type) {
      case 'allTime':
        setAllTime(audio.duration);
        setDisabled(isNaN(audio.duration) || !isFinite(audio.duration));
        if (onCanPlay) {
          onCanPlay();
        }
        break;
      case 'play':
        if (disabled) {
          return;
        }
        audio.play();
        setIsPlay(true);
        break;
      case 'pause':
        if (disabled) {
          return;
        }
        audio.pause();
        setIsPlay(false);
        break;
      case 'changeCurrentTime':
        setCurrentTime(value || 0);

        audio.currentTime = value as number;
        if (value === audio.duration) {
          setIsPlay(false);
        }
        break;
      case 'getCurrentTime':
        setCurrentTime(audio.currentTime);
        if (audio.currentTime === audio.duration) {
          setIsPlay(false);
        }
        break;
      case 'changeVolume':
        audio.volume = (value as number) / 100;
        setCurrentVolume(value || 0);
        setIsMuted(!value);
        break;
      case 'changeRate':
        if (Number.isNaN(numberValue)) {
          throw new Error(`rateOptions props error:
          rateOptions.value or item of rateOptions.range can not convert to number`);
        }
        audio.playbackRate = numberValue;
        setRate(value || 0);
        setRateOpen(false);
        break;
    }
  };

  React.useEffect(() => {
    controlAudio('changeRate', rate);
    if (autoPlay) {
      audioInstance.current.play();
    }
  }, []);

  const millisecondToDate = (time: number, format = true) => {
    const second = Math.floor(time % 60);
    let minute = Math.floor(time / 60);
    if (!format) {
      return minute * 60 + second;
    }
    let hour;
    if (minute > 60) {
      hour = minute / 60;
      minute = minute % 60;
      return `${Math.floor(hour)}:${Math.floor(minute)}:${Math.floor(second)}`;
    }
    return `${minute}:${second >= 10 ? second : `0${second}`}`;
  };

  const getVolumePopupContent = () => {
    return (
      <div className="change-audio-volume-box">
        <div className="change-audio-volume-value">{currentVolume}%</div>
        <div className="change-audio-volume-slider">
          <Slider
            vertical
            min={0}
            max={100}
            step={1}
            defaultValue={currentVolume}
            onChange={(value: number) => controlAudio('changeVolume', value)}
          />
        </div>
      </div>
    );
  };

  // 调节音量面板状态变化
  const onVolumeVisibleChange = (state: boolean) => {
    setVolumeOpen(state);
  };

  // 调节播放速度板状态变化
  const onRateVisibleChange = (state: boolean) => {
    setRateOpen(state);
  };

  const {
    value: rateValue = 0,
    suffix: rateSuffix = 'x',
    decimal: rateDecimal = 1,
    range: rateRange = [],
  } = rateOptions!;
  const getRateText = (rate: number) => `${Number(rate).toFixed(rateDecimal)}${rateSuffix}`;

  const sizeCls = size === 'small' ? 'sm' : '';
  const volumeIcon = () => {
    const className = 'handle-audio-icon control-volume';
    if (isMuted || currentVolume === 0) {
      return <AudioMutedOutlined className={className} />;
    } else if (currentVolume > 0 && currentVolume <= 50) {
      return <SoundOutlined className={className} />;
    } else {
      return <SoundOutlined className={className} />;
    }
  };

  return (
    <div
      className={classNames(prefixCls, className, {
        [`${prefixCls}-${sizeCls}`]: sizeCls,
      })}
    >
      <div
        className={classNames(`${prefixCls}-wrap`, {
          [`${prefixCls}-${sizeCls}-wrap`]: sizeCls,
        })}
        title={title}
      >
        <div className="audio-box">
          <audio
            ref={audioInstance}
            src={src}
            preload={preload}
            loop={loop}
            // eslint-disable-next-line react/no-unknown-property
            volume={currentVolume / 100}
            onCanPlay={() => controlAudio('allTime')}
            onTimeUpdate={() => controlAudio('getCurrentTime')}
            onLoadedMetadata={onLoadedMetadata}
            onCanPlayThrough={onCanPlayThrough}
            onAbort={onAbort}
            onEnded={onEnded}
            onError={onError}
            onPause={onPause}
            onPlay={onPlay}
            onSeeked={onSeeked}
            {...otherProps}
          >
            {'not support'}
          </audio>
        </div>

        <div
          className={`box pause-play-box pause-play-box-${disabled ? 'disabled' : 'enable'}`}
          onClick={() => controlAudio(isPlay ? 'pause' : 'play')}
        >
          {!isPlay ? (
            <CaretRightOutlined className="handle-audio-icon pause-play" />
          ) : (
            <PauseOutlined className="handle-audio-icon pause-play" />
          )}
        </div>

        {controlProgress ? (
          <div className="box step-box">
            <Slider
              step={1}
              min={0}
              max={Number(millisecondToDate(allTime, false))}
              value={currentTime}
              disabled={disabled}
              tooltip={{
                // @ts-ignore
                formatter: (value: number) => millisecondToDate(value as number),
              }}
              onChange={(value: number) => controlAudio('changeCurrentTime', value)}
            />
          </div>
        ) : null}

        {displayTime ? (
          <div className="box time-box">
            <span className="current">
              {millisecondToDate(currentTime as number) + ' / ' + millisecondToDate(allTime)}
            </span>
          </div>
        ) : null}

        {controlVolume ? (
          <Popover
            overlayClassName="change-audio-volume"
            trigger="click"
            placement="top"
            content={getVolumePopupContent()}
            open={volumeOpen}
            onOpenChange={onVolumeVisibleChange}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <div className="box volume-box">{volumeIcon()}</div>
          </Popover>
        ) : null}

        {rateRange.length ? (
          <Popover
            overlayClassName="change-audio-rate"
            trigger="click"
            placement="top"
            open={rateOpen}
            onOpenChange={onRateVisibleChange}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
            content={rateRange.map((rateItem) => (
              <p
                className="change-audio-rate-item"
                style={{ '--colorPrimaryHover': variables?.colorPrimaryHover }}
                key={`rate-${rateItem}`}
                onClick={() => {
                  controlAudio('changeRate', rateItem);
                }}
              >
                {getRateText(rateItem)}
              </p>
            ))}
          >
            {<p className="box rate-box">{getRateText(rate)}</p>}
          </Popover>
        ) : rateValue ? (
          <p className="box rate-box">{getRateText(rateValue)}</p>
        ) : null}

        {download ? (
          <div className="box download-box">
            <a download target="_blank" rel="noopener noreferrer" href={src}>
              <DownloadOutlined className="handle-audio-icon download" />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AudioPlayer = React.forwardRef<unknown, AudioPlayerProps>(InternalAudioPlayer);
AudioPlayer.defaultProps = {
  prefixCls: 'audio-player',
  className: '',
  size: 'default',
  title: '',
  src: '',
  loop: false,
  preload: 'metadata',
  autoPlay: false,
  muted: false,
  volume: 1.0,
  controlVolume: true,
  controlProgress: true,
  displayTime: true,
  rateOptions: { value: 0 },
  download: false,
  onLoadedMetadata: () => {}, // 当浏览器已加载音频的元数据时的回调
  onCanPlay: () => {}, // 当浏览器能够开始播放音频时的回调
  onCanPlayThrough: () => {}, // 当浏览器可在不因缓冲而停顿的情况下进行播放时的回调
  onAbort: () => {}, // 当音频的加载已放弃时(如切换到其他资源)的回调
  onEnded: () => {}, // 当目前的播放列表已结束时的回调
  onError: () => {}, // 当在音频加载期间发生错误时的回调
  onPause: () => {}, // 当音频暂停时的回调
  onPlay: () => {}, // 当音频已开始或不再暂停时的回调
  onSeeked: () => {}, // 当用户已移动/跳跃到音频中的新位置时的回调
};

export default AudioPlayer;

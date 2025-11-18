import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

export interface UseFullscreenOptions {
  /** 是否显示全屏按钮 */
  visible?: boolean;
  /** 进入全屏时的回调 */
  onEnter?: () => void;
  /** 退出全屏时的回调 */
  onExit?: () => void;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义全屏容器类名 */
  fullscreenClassName?: string;
}

export interface UseFullscreenReturn {
  /** 是否处于全屏状态 */
  isFullscreen: boolean;
  /** 进入全屏 */
  enterFullscreen: () => void;
  /** 退出全屏 */
  exitFullscreen: () => void;
  /** 切换全屏状态 */
  toggleFullscreen: () => void;
  /** 全屏按钮组件 */
  FullscreenButton: React.FC;
  /** 全屏容器类名 */
  fullscreenClass: string;
  /** 设置全屏状态 */
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useFullscreen(options: UseFullscreenOptions = {}): UseFullscreenReturn {
  const {
    visible = true,
    onEnter,
    onExit,
    className = '',
    fullscreenClassName = 'fullscreen-container',
  } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  // 进入全屏
  const enterFullscreen = () => {
    setIsFullscreen(true);
    onEnter?.();
  };

  // 退出全屏
  const exitFullscreen = () => {
    setIsFullscreen(false);
    onExit?.();
  };

  // 切换全屏状态
  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // 处理body滚动和容器调整
  useEffect(() => {
    if (isFullscreen) {
      // 禁止body滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复body滚动
      document.body.style.overflow = '';
    }

    // 如果有容器引用，调用resize方法
    if (containerRef.current && typeof (containerRef.current as any).resize === 'function') {
      (containerRef.current as any).resize();
    }
  }, [isFullscreen]);

  // 全屏按钮组件
  const FullscreenButton: React.FC = () => {
    if (!visible) return null;

    return isFullscreen ? (
      <Tooltip title="退出全屏">
        <FullscreenExitOutlined
          className={`fullscreenIcon exitIcon ${className}`}
          onClick={exitFullscreen}
        />
      </Tooltip>
    ) : (
      <Tooltip title="全屏">
        <FullscreenOutlined
          className={`fullscreenIcon enterIcon ${className}`}
          onClick={enterFullscreen}
        />
      </Tooltip>
    );
  };

  // 全屏容器类名
  const fullscreenClass = isFullscreen ? fullscreenClassName : '';

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    FullscreenButton,
    fullscreenClass,
    setIsFullscreen,
  };
}

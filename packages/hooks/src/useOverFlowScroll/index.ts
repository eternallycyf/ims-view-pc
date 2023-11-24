import { useEffect, useRef } from 'react';

/**
 * 自定义 hook 用于控制指定容器的滚动条显示与隐藏。
 * @param {string} container - 要控制的容器的选择器。
 * @param {boolean} hidden - 控制滚动条的显示与隐藏，为 true 表示隐藏。
 */
const useOverFlowScroll = (container: string, hidden: boolean) => {
  const isHidden = useRef<boolean>(false); // 当前状态

  /**
   * 获取指定元素的滚动条宽度。
   * @param {HTMLElement} element - 要获取滚动条宽度的元素。
   * @returns {number} - 滚动条的宽度。
   */
  const getScrollBarWidth = (element: HTMLElement) => {
    return element.tagName === 'BODY'
      ? window.innerWidth - (document.body.clientWidth || document.documentElement.clientWidth)
      : element.offsetWidth - element.clientWidth;
  };

  /**
   * 设置指定容器的滚动条隐藏。
   */
  const setContainerHidden = () => {
    // 设置滚动条隐藏
    const dom = document.querySelector(`${container}`) as HTMLElement;
    if (dom && dom.style.overflow !== 'hidden') {
      dom.style.width = `calc(100% - ${getScrollBarWidth(dom)}px)`;
      dom.style.overflow = 'hidden';
      isHidden.current = true;
    }
  };

  /**
   * 恢复指定容器的滚动条。
   */
  const resetContainer = () => {
    // 恢复
    if (isHidden.current && document.querySelector(`${container}`)) {
      isHidden.current = false;
      const dom = document.querySelector(`${container}`) as HTMLElement;
      dom.removeAttribute('style');
    }
  };

  useEffect(() => {
    // 根据 hidden 的值设置或者重置滚动条
    if (hidden) {
      setContainerHidden();
    } else {
      resetContainer();
    }
    // 在组件销毁时重置滚动条
    return () => {
      resetContainer();
    };
  }, [hidden, container]);
};

export default useOverFlowScroll;

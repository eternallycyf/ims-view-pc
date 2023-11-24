import { RefObject, useEffect } from 'react';

/**
 * Hook 用于检测点击事件是否发生在指定的元素之外。
 * @param {RefObject<HTMLElement>} ref - 要监视的元素的引用。
 * @param {(event: MouseEvent) => any} handler - 外部点击事件的处理函数。
 */
function useClickOutside(ref: RefObject<HTMLElement>, handler: (event: MouseEvent) => any) {
  useEffect(() => {
    /**
     * 处理点击事件的函数。
     * @param {MouseEvent} event - 鼠标点击事件。
     */
    const listener = (event: MouseEvent) => {
      // 检查点击事件是否发生在指定的元素之内
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }
      // 处理外部点击事件
      handler(event);
    };

    // 在文档上添加点击事件监听器
    document.addEventListener('click', listener);

    // 在组件销毁时移除点击事件监听器
    return () => {
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;

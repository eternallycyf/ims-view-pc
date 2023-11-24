import { RefObject } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useMemoizedFn from '../useMemoizedFn';

/**
 * 自定义 hook 用于在目标元素大小变化时触发效果。
 * @template T - 目标元素的类型。
 * @param {(target: T) => void} effect - 当目标元素大小变化时要触发的效果函数。
 * @param {RefObject<T>} targetRef - 包含目标元素引用的 Ref 对象。
 */
export default function useResizeEffect<T extends HTMLElement>(
  effect: (target: T) => void,
  targetRef: RefObject<T>,
) {
  // 使用 useMemoizedFn 记忆化 effect 函数
  const fn = useMemoizedFn(effect);

  // 使用 useIsomorphicLayoutEffect 处理在 SSR 环境中的 layout 效果
  useIsomorphicLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    if (window.ResizeObserver) {
      let animationFrame: number;

      // 使用 ResizeObserver 监听目标元素的大小变化
      const observer = new ResizeObserver(() => {
        // 使用 requestAnimationFrame 来延迟触发效果函数
        animationFrame = window.requestAnimationFrame(() => fn(target));
      });

      observer.observe(target);

      // 在组件销毁时取消监听和动画帧
      return () => {
        window.cancelAnimationFrame(animationFrame);
        observer.disconnect();
      };
    } else {
      // 如果不支持 ResizeObserver，则直接触发效果函数
      fn(target);
    }
  }, [targetRef, fn]);
}

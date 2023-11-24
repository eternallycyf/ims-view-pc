import { RefObject, useEffect, useState } from 'react';

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * 自定义 hook 用于在虚拟列表中监听元素的可见性。
 * @param {RefObject<Element>} elementRef - 虚拟列表父盒子的 ref。
 * @param {Args} options - 选项对象，包含 threshold、root、rootMargin 和 freezeOnceVisible。
 * @returns {IntersectionObserverEntry | undefined} - IntersectionObserverEntry 对象，表示当前可视区的信息。
 */
function useVirtualList(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args,
): IntersectionObserverEntry | undefined {
  // 使用 useState 创建状态来存储 IntersectionObserverEntry 对象
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  // 检查是否应该冻结（缓存）可见性
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  // 更新 entry 的回调函数
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    // 如果不支持 IntersectionObserver 或者已冻结或者没有目标元素，直接返回
    if (!hasIOSupport || frozen || !node) return;

    // 创建 IntersectionObserver 实例并开始观察目标元素
    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);
    observer.observe(node);

    // 在组件卸载时取消观察
    return () => observer.disconnect();
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  // 返回当前可视区信息的 IntersectionObserverEntry 对象
  return entry;
}

export default useVirtualList;

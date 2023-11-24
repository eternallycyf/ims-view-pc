import { useEffect, useState } from 'react';

/**
 * 自定义 hook 用于在值变化后延迟一定时间后再更新状态。
 * @template T - 值的类型。
 * @param {T} value - 要进行防抖的值。
 * @param {number} delay - 防抖的延迟时间，单位毫秒，默认为300毫秒。
 * @returns {T} - 防抖后的值。
 */
function useDebounce<T>(value: T, delay = 300): T {
  // 用于存储防抖后的值的状态
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置一个延时器，在指定的延迟后更新状态
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 在组件卸载或者值变化时清除之前的延时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // 返回防抖后的值
  return debouncedValue;
}

export default useDebounce;

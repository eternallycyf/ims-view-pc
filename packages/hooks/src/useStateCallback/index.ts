import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

/**
 * 自定义 hook 用于在更新状态时触发回调函数。
 * @template T - 状态值的类型。
 * @param {T} defaultVal - 初始状态值。
 * @returns {[T, (newVal: SetStateAction<T>, callback: (state: SetStateAction<T>) => any) => void]} - 一个包含当前状态和更新状态的函数的数组。
 */
const useStateCallback = <T = any>(defaultVal: T) => {
  // 使用 useState 创建状态
  const [state, setState] = useState(defaultVal);

  // 使用 useRef 创建一个 ref，用于存储回调函数
  const listenRef = useRef<(state: SetStateAction<T>) => any>(); // 监听新状态的回调器

  /**
   * 更新状态的回调函数，同时触发传入的回调函数。
   * @param {SetStateAction<T>} newVal - 新的状态值。
   * @param {(state: SetStateAction<T>) => any} callback - 在更新状态后要触发的回调函数。
   */
  const _setState = useCallback(
    (newVal: SetStateAction<T>, callback: (state: SetStateAction<T>) => any) => {
      // 更新状态值
      listenRef.current = callback;
      setState(newVal);
    },
    [],
  );

  // 使用 useEffect 在状态更新后触发回调函数
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    listenRef.current && listenRef.current(state); // 回调新状态
  }, [state]);

  // 返回包含当前状态和更新状态的函数的数组
  return [state, _setState];
};

export default useStateCallback;

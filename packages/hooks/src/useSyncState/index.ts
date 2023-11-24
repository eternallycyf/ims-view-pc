import * as React from 'react';
import useForceUpdate from '../useForceUpdate';

/**
 * 自定义 hook 用于创建具有同步状态的 React 组件。
 * @template T - 状态值的类型。
 * @param {T} initialValue - 初始状态值。
 * @returns {readonly [T, (newValue: T) => void]} - 一个包含当前状态和更新状态的函数的只读数组。
 */
export default function useSyncState<T>(initialValue: T): readonly [T, (newValue: T) => void] {
  // 使用 useRef 创建一个 ref，用于存储状态值
  const ref = React.useRef<T>(initialValue);

  // 使用 useForceUpdate 创建强制更新函数
  const forceUpdate = useForceUpdate();

  // 返回包含当前状态和更新状态的函数的只读数组
  return [
    ref.current,
    (newValue: T) => {
      // 更新状态值
      ref.current = newValue;

      // 通过强制更新触发组件重新渲染
      forceUpdate();
    },
  ] as const;
}

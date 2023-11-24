import { useMemo, useRef } from 'react';

// 定义 noop 类型，表示不执行任何操作的函数
type noop = (this: any, ...args: any[]) => any;

// 定义 PickFunction 类型，表示选取函数的类型
type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

/**
 * 使用 useMemo 优化的自定义 hook，用于记忆化函数。
 * @template T - 函数的类型。
 * @param {T} fn - 需要进行记忆化的函数。
 * @returns {T} - 记忆化后的函数。
 */
function useMemoizedFn<T extends noop>(fn: T) {
  // 使用 useRef 创建一个可以保存函数引用的 ref
  const fnRef = useRef<T>(fn);

  // 使用 useMemo 来确保只有在函数变化时才重新创建函数
  fnRef.current = useMemo(() => fn, [fn]);

  // 创建一个 memoizedFn 的 ref
  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    // 如果 memoizedFn 不存在，创建一个新的函数，该函数会调用最新的 fn
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  // 返回记忆化后的函数
  return memoizedFn.current as T;
}

export default useMemoizedFn;

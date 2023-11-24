import { useEffect, useLayoutEffect } from 'react';

// 检查是否在浏览器环境中
const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/**
 * 选择使用在浏览器环境中的 `useLayoutEffect` 或在非浏览器环境中的 `useEffect`。
 * 在 SSR（服务器端渲染）中，使用 `useEffect` 避免引起警告。
 */
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

import * as React from 'react';

/**
 * 强制组件重新渲染的 hook
 * @returns 强制更新函数
 */
export default function useForceUpdate() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  return forceUpdate;
}

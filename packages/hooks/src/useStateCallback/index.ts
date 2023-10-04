import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

const useStateCallback = <T = any>(defaultVal: T) => {
  const [state, setState] = useState(defaultVal);
  const listenRef = useRef<(state: SetStateAction<T>) => any>(); // 监听新状态的回调器
  const _setState = useCallback(
    (newVal: SetStateAction<T>, callback: (state: SetStateAction<T>) => any) => {
      // 更新业务
      listenRef.current = callback;
      setState(newVal);
    },
    [],
  );
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    listenRef.current && listenRef.current(state); // 回调新状态
  }, [state]);

  return [state, _setState];
};

export default useStateCallback;

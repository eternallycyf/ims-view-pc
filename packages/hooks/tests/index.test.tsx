import { useSyncState } from '@ims-view/hooks';
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

test('CommonDemo', () => {
  const hook = renderHook(() => useSyncState(0));
  const [num, setNumber] = hook.result.current;
  act(() => {
    setNumber(1);
  });
  expect(hook.result.current[0]).toBe(1);
  act(() => {
    setNumber(2);
  });
  expect(hook.result.current[0]).toBe(2);
  hook.unmount();
});

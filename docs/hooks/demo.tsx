import * as hooks from '@ims-view/hooks';
import React from 'react';

const Demo = () => {
  let [number, setNumber] = hooks.useSyncState<number>(5);

  return (
    <div>
      <div>{number}</div>
      <button onClick={() => setNumber(number + 1)}>+</button>
      <button onClick={() => setNumber(number - 1)}>-</button>
    </div>
  );
};
export default Demo;

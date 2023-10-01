import * as hooks from '@ims-view/hooks';
import React from 'react';

const Demos = () => {
  let [number, setNumber] = hooks.useSyncState<number>(0);

  return (
    <div>
      <button onClick={() => setNumber(number++)}>+</button>
      {number}
      <button onClick={() => setNumber(number--)}>-</button>
    </div>
  );
};
export default Demos;

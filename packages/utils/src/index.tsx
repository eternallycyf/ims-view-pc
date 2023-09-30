import Foo from '@ims-view/hooks';
import React, { FC } from 'react';

const Bar: FC = () => {
  return (
    <div>
      hello Bar!
      <Foo />
    </div>
  );
};

export default Bar;

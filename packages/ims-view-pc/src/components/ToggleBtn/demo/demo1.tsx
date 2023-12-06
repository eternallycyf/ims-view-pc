import { ToggleBtn } from 'ims-view-pc';
import { useState } from 'react';

const toggleDict = {
  '0': {
    buttonType: 'primary',
    label: 'before',
    // hasTooltip: false,
    tooltip: 'before...',
  },
  '1': {
    buttonType: 'default',
    label: 'after',
    // hasTooltip: false,
    tooltip: 'after...',
  },
} as const;

const Demo = () => {
  const [isPositive, setIsPositive] = useState<keyof typeof toggleDict>('0');
  return (
    <>
      <ToggleBtn<typeof toggleDict>
        status={isPositive}
        // setStatus={setIsPositive}
        dict={toggleDict}
        cb={(status) => setIsPositive(status)}
      ></ToggleBtn>
    </>
  );
};

export default Demo;

import { useMutateObserver } from '@ims-view/hooks';
import React, { useLayoutEffect } from 'react';
import './index.less';
import type { MutationObserverProps } from './interface';

const MutateObserver: React.FC<MutationObserverProps> = (props) => {
  const { options, onMutate = () => {}, children } = props;

  const elementRef = React.useRef<HTMLElement>(null);

  const [target, setTarget] = React.useState<HTMLElement>();

  useMutateObserver(target!, onMutate, options);

  useLayoutEffect(() => {
    setTarget(elementRef.current!);
  }, []);

  if (!children) {
    return null;
  }

  return React.cloneElement(children, { ref: elementRef });
};

export default MutateObserver;

import copy from 'copy-to-clipboard';
import React, { EventHandler, FC, PropsWithChildren, ReactElement } from 'react';
import type { ClipboardProps } from './interface';

const CopyToClipboard: FC<ClipboardProps> = (props) => {
  const { text, onCopy, children, options } = props;

  const elem = React.Children.only(children);

  function onClick(event: MouseEvent) {
    const elem = React.Children.only(children);

    const result = copy(text, options);

    if (onCopy) {
      onCopy(text, result);
    }

    if (typeof elem?.props?.onClick === 'function') {
      elem.props.onClick(event);
    }
  }

  return React.cloneElement(elem, { onClick });
};

export default CopyToClipboard;

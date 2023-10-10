import React from 'react';
import { ICommonCardAnchorLinkProps } from './interface';

function AnchorLink<Values extends string>(
  props: ICommonCardAnchorLinkProps<Values>,
): React.ReactElement {
  const { id, children, ...restProps } = props;
  return (
    <div id={id} {...restProps}>
      {children}
    </div>
  );
}

export default AnchorLink;

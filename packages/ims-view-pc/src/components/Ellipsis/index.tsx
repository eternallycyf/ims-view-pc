import React from 'react';
import Ellipsis from './Ellipsis';
import Expand from './Expand';

type CompoundedComponent = typeof Ellipsis & {
  Expand: typeof Expand;
};

const CommonEllipsis = Ellipsis as CompoundedComponent;

CommonEllipsis.Expand = Expand;

export default CommonEllipsis;

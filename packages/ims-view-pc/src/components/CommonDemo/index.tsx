import React from 'react';
import CommonDemoComponent from './CommonDemo';
import { ICommonDemoHandle, ICommonDemoProps } from './interface';
import Item from './Item';

const CompoundedCommonDemo = React.forwardRef<ICommonDemoHandle, ICommonDemoProps>(
  CommonDemoComponent,
) as <Values = Record<string, unknown>>(
  props: React.PropsWithChildren<ICommonDemoProps<Values>> & {
    ref?: React.Ref<ICommonDemoHandle<Values>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonDemo & {
  Item: typeof Item;
};

const CommonDemo = CompoundedCommonDemo as CompoundedComponent;

CommonDemo.Item = Item;

export default CommonDemo;

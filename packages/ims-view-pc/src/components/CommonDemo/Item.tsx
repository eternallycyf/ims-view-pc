import React from 'react';
import { ICommonDemoItemProps } from './interface';

function Item<Values = any>(props: ICommonDemoItemProps<Values>): React.ReactElement {
  return <span></span>;
}

export default Item;

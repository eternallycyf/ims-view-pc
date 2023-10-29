import React from 'react';

export interface ICommonEditTableItemProps<T = any> {}

function Item<Values = any>(props: ICommonEditTableItemProps<Values>): React.ReactElement {
  return <span></span>;
}

export default Item;

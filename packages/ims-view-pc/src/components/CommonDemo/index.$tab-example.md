---
order: 2
title: Demos
---

## Demos

### index.tsx

```tsx | pure
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
```

### interface.tsx

```tsx | pure
import { useFetchProps, useFetchState } from '@ims-view/hooks';

/**
 * @typedef ICommonDemoHandle - demo组件
 * @template T - 列表项record
 * @property {(defaultParams?: any, defaultData?: any) => Promise<T[]>} fetchData - 请求数据
 * @example <caption>fetchData</caption>
 * await CommonDemoRef.current?.fetchData({ kw: 1 }, { num: 2 });
 */
export type ICommonDemoHandle<T = Record<string, any>> = {
  fetchData: useFetchState<T>['1'];
  data: T;
  loading: boolean;
};

/**
 * @typedef ICommonDemoProps - demo组件
 * @template T - 列表项record
 */
export interface ICommonDemoProps<T = Record<string, any>> extends useFetchProps<T> {
  children?: React.ReactNode;
}

export interface ICommonDemoItemProps<T = any> {}
```

### CommonDemo.tsx

```tsx | pure
import { useFetch } from '@ims-view/hooks';
import React, { Fragment, useImperativeHandle } from 'react';
import { ICommonDemoHandle, ICommonDemoProps } from './interface';

const CommonDemo: React.ForwardRefRenderFunction<ICommonDemoHandle, ICommonDemoProps> = (
  props,
  ref,
) => {
  const { fetchConfig, dataHandler, request, children } = props;
  const [{ value: data = {}, loading }, fetchData] = useFetch({
    fetchConfig,
    dataHandler,
    request,
  });

  useImperativeHandle(ref, () => ({
    data,
    loading,
    fetchData,
  }));

  return <Fragment>{children}</Fragment>;
};

export default CommonDemo;
```

### Item.tsx

```tsx | pure
import React from 'react';
import { ICommonDemoItemProps } from './interface';

function Item<Values = any>(props: ICommonDemoItemProps<Values>): React.ReactElement {
  return <span></span>;
}

export default Item;
```

### index.md

- [参考本页面](https://github.com/eternallycyf/ims-view-pc/tree/master/packages/ims-view-pc/src/components/CommonDemo/index.md)

### 示例/index.tsx

- 略

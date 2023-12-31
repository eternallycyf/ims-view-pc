---
title: useOverFlowScroll
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useOverFlowScroll/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useOverFlowScroll/index.ts
---

## useOverFlowScroll

```ts
import { useEffect, useRef } from 'react';

/**
 * @container 容器查找内容
 * @hidden 指令，命令显示/隐藏
 */
const useOverFlowScroll = (container: string, hidden: boolean) => {
  const isHidden = useRef<boolean>(false); // 当前状态

  const getScrollBarWidth = (element: HTMLElement) => {
    // 获取元素的滚动条宽度
    return element.tagName === 'BODY'
      ? window.innerWidth - (document.body.clientWidth || document.documentElement.clientWidth)
      : element.offsetWidth - element.clientWidth;
  };
  const setContainerHidden = () => {
    // 设置滚动条隐藏

    const dom = document.querySelector(`${container}`) as HTMLElement;
    if (dom && dom.style.overflow !== 'hidden') {
      dom.style.width = `calc(100% - ${getScrollBarWidth(dom)}px)`;
      dom.style.overflow = 'hidden';
      isHidden.current = true;
    }
  };

  const resetContainer = () => {
    // 恢复
    if (isHidden.current && document.querySelector(`${container}`)) {
      isHidden.current = false;
      const dom = document.querySelector(`${container}`) as HTMLElement;
      dom.removeAttribute('style');
    }
  };
  useEffect(() => {
    if (hidden) {
      setContainerHidden();
    } else {
      resetContainer();
    }
    return () => {
      resetContainer();
    };
  }, [hidden, container]);
};

export default useOverFlowScroll;
```

## Params

| 属性      | 说明                | 类型      | 默认值 |
| --------- | ------------------- | --------- | ------ |
| contanier | 容器查找内容        | `string`  | -      |
| hidden    | 指令，命令显示/隐藏 | `boolean` | -      |

## Result

| 属性 | 说明 | 类型 |
| ---- | ---- | ---- |

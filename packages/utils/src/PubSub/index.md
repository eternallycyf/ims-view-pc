---
title: PubSub
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/PubSub/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/PubSub/index.tsx
---

## PubSub

发布订阅模式 用于组件间通信

- 跳转路由后手动触发
- 兄弟组件通信

- 支持 class 组件
- 支持 hook

```ts
import { PubSub } from '@ims-view/utils';
```

### 使用

### class

```ts
constructor() {
  PubSub.on('someEvent', this.someEvent)
}
componentWillUnmount() {
  PubSub.off('someEvent', this.someEvent)
}
handleOnClick = (record) => {
  PubSub.emit('someEvent', record)
}
someEvent = () => {
  // do something
}
```

### hook

<code src='./demo.tsx'></cide>

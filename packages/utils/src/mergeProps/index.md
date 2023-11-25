---
title: mergeProps
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/mergeProps/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/mergeProps/index.tsx
---

## mergeProps

合并 props

```tsx | pure
const defaultProps = {
  name: 2,
};
const App = (p) => {
  const props = mergeProps(defaultProps, p);
  return <div>app</div>;
};
```

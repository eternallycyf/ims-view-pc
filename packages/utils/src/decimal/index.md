---
title: decimal
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/decimal/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/decimal/index.tsx
---

## decimal 大数字计算

```ts
import { decimal } from '@ims-view/utils';
const { add, subtract, multiply, divide } = decimal;
```

### add

```ts
/**
 * @description 加法
 * @type {(a: number, b: number) => number}
 * @returns {number}
 * @example <caption>add</caption>
 * add(0.1, 0.2) // 0.3
 */
```

### subtract

```ts
/**
 * @description 减法
 * @type {(a: number, b: number) => number}
 * @returns {number}
 * @example <caption>subtract</caption>
 * subtract(0.3, 0.2) // 0.1
 */
```

### multiply

```ts
/**
 * @description 乘法
 * @type {(a: number, b: number) => number}
 * @returns {number}
 * @example <caption>multiply</caption>
 * multiply(0.1, 0.2) // 0.02
 */
```

### divide

```ts
/**
 * @description 除法
 * @type {(a: number, b: number) => number}
 * @returns {number}
 * @example <caption>divide</caption>
 * divide(0.3, 0.2) // 1.5
 */
```

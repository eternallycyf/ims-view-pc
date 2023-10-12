---
title: random
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/random/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/random/index.tsx
---

## random

```ts
import { random } from '@ims-view/utils';
const { getId, randomString, getUUID } = random;
```

### getId

```ts
/**
 * 返回一个6位随机字符串 由数字和字母组成
 * @type {() => string}
 * @returns {string}
 * @example <caption>getId</caption>
 * getId() // 'ei21he'
 */
```

### randomString

```ts
/**
 * 随机生成指定长度的字符串
 * @type {(length: number) => string}
 * @param {string} [length=32] 长度
 * @returns {string}
 * @example <caption>randomString</caption>
 * randomString() // 'qJXWQmggfiikMVeatvev2WdxexrNZucN'
 */
```

### getUUID

```ts
/**
 * 生成uuid
 * @type {() => string}
 * @returns {string}
 * @example <caption>getUUID</caption>
 * getUUID() // 'ace9f6be-d7a6-400b-8681-bf9a54f48973'
 */
```

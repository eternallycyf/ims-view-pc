---
title: ase
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/ase/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/ase/index.tsx
---

## ase 加密解密

```ts
import { ase } from '@ims-view/utils';
const { aesEncrypt, aesDecrypt } = ase;
```

### aesEncrypt

```ts
/**
 * AES加密
 * @param data
 * @param {string} [secretKey="ase"] - 密钥
 * @returns {string} 加密后的字符串
 * @example <caption>aesEncrypt</caption>
 * aesEncrypt('123456', '123456') // 8b3a2b7c2b1a2b7c2b1a2b7c2b1a2b7c
 */
```

### aesDecrypt

```ts
/**
 * AES解密
 * @param data
 * @param {string} [secretKey="ase"] - 密钥
 * @returns {string} 解密后的字符串
 * @example <caption>aesDecrypt</caption>
 * aesDecrypt('8b3a2b7c2b1a2b7c2b1a2b7c2b1a2b7c', '123456') // 123456
 */
```

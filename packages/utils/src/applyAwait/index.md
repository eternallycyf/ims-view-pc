---
title: applyAwait
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/applyAwait/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/applyAwait/index.ts
---

## applyAwait

```ts
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 * 1. success - [null, data]
 * 2. error - [err, undefined]
 */
export function applyAwait<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export default applyAwait;
```

## use

```ts
// before
async function handleInit(cb) {
  try {
    const user = await fetch('1');
    if (!user) return cb('No user found');
  } catch (e) {
    return cb('Unexpected error occurred');
  }
}

// after
async function handleInit(cb) {
  const [err, user] = await applyAwait(fetch('1'));
  if (err) return cb('Unexpected error occurred');
  if (!user) return cb('No user found');
}
```

## Params

| 属性     | 说明     | 类型      | 默认值 |
| -------- | -------- | --------- | ------ |
| promise  | promise  | `Promise` | -      |
| errorExt | errorExt | `object`  | -      |

## return

### success

- `[null, data]`

| 属性 | 说明 | 类型   | 默认值 |
| ---- | ---- | ------ | ------ |
| 0    | err  | `null` | -      |
| 1    | data | `T`    | -      |

### error

- `[err, undefined]`

| 属性 | 说明 | 类型        | 默认值 |
| ---- | ---- | ----------- | ------ |
| 0    | err  | `U`         | -      |
| 1    | data | `undefined` | -      |

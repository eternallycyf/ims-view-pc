---
title: CheckModal
toc: content
group:
  title: 表单
---

## CheckModal

## 示例

<code src='./demo/index.tsx'></code>

## API

### CheckModalProps

| 名称          | 类型                                      | 默认值 | 描述 |
| ------------- | ----------------------------------------- | ------ | ---- |
| CheckModalRef | `React.Ref<CheckModalHandle>`             | -      | -    |
| form          | `FormInstance`                            | -      | -    |
| name          | `string`                                  | -      | -    |
| option        | `Record<string, CheckBoxRecord[]>`        | -      | -    |
| value         | `Record<string, CheckBoxRecord[] \| any>` | -      | -    |
| onChange      | `(value: any) => void`                    | -      | -    |
| modalProps    | `ModalProps`                              | -      | -    |
| onOk          | `(value: any) => void`                    | -      | -    |
| onCancel      | `() => void`                              | -      | -    |

### CheckModalHandle

```ts
export type CheckModalHandle = {
  sortBy: typeof sortBy;
  mapKeysDeep: typeof mapKeysDeep;
};
```

```ts
/**
 * @example <caption>sortBy</caption>
 * from: sortBy({a:['姓名', [{label:'zs',value:'zs'}]], b:['账号', [{label:'zs',value:'zs'}]] }, ['账号', '姓名'])
 * to:   {a:['账号', [{label:'zs',value:'zs'}]], b:['姓名', [{label:'zs',value:'zs'}]] }
 */
export function sortBy<T extends any[]>(data: T, idOrder: Array<string | number>): T {
  const orderMap = Object.fromEntries(idOrder.map((id, i) => [id, i])) as any as T;
  return data.sort((a, b) => orderMap[a[0]] - orderMap[b[0]]);
}

/**
 * @example <caption>mapKeysDeep</caption>
 * customKeys={(value, key) => {
 *  if (key === '账号') return 'account';
 *  if (key === '姓名') return 'name';
 *  return key;
 * }}
 */
export const mapKeysDeep = (
  obj: Record<string, any>,
  cb: (value: any, key: string) => string,
): Record<string, any> =>
  _.mapValues(_.mapKeys(obj, cb), (val) => (_.isObject(val) ? mapKeysDeep(val, cb) : val));
```

### CheckBoxRecord

| 名称     | 类型               | 默认值 | 描述 |
| -------- | ------------------ | ------ | ---- |
| label    | `string`           | -      | -    |
| value    | `string \| number` | -      | -    |
| disabled | `boolean`          | -      | -    |

### CheckModalBoxProps

| 名称     | 类型                                                                        | 默认值 | 描述 |
| -------- | --------------------------------------------------------------------------- | ------ | ---- |
| label    | `string`                                                                    | -      | -    |
| value    | `CheckBoxRecord[]`                                                          | -      | -    |
| option   | `CheckBoxRecord[]`                                                          | -      | -    |
| onChange | `(label: string, list: CheckBoxRecord[], option: CheckBoxRecord[]) => void` | -      | -    |

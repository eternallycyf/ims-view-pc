import _ from 'lodash';

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

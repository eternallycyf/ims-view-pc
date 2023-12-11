//#region
import { AriaAttributes, CSSProperties } from 'react';
export { ObjectPaths, Paths } from './path';
export { SnakeCase } from './SnakeCase';
/*----------------------------base-----------------------------------------------------*/
type Copy<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key];
};

/*----------------------------judge-----------------------------------------------------*/
export type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

export type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;

export type IsNever<T> = [T] extends [never] ? true : false;

export type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? false
  : true;

export type IsTuple<T> = T extends [...params: infer Eles]
  ? NotEqual<Eles['length'], number>
  : false;

/*----------------------------deep-----------------------------------------------------*/

export type DeepReadonly<Obj extends Record<string, any>> = {
  readonly [Key in keyof Obj]: Obj[Key] extends object
    ? Obj[Key] extends Function
      ? Obj[Key]
      : DeepReadonly<Obj[Key]>
    : Obj[Key];
};

// 递归取出Promise中的类型
export type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<infer ValueType>
  ? ValueType extends Promise<unknown>
    ? DeepPromiseValueType<ValueType>
    : ValueType
  : never;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/*----------------------------utils-----------------------------------------------------*/
/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends string> = T | (string & {});

export type WithNativeStyle<S extends string = never> = CSSProperties &
  Partial<Record<S, string>> &
  AriaAttributes;

export type AnyObject = Record<PropertyKey, any>;

export type ValueOf<T> = T[keyof T];

export type Merge<T, K> = Omit<T, keyof K> & K;

// 联合转交叉
export type UnionToIntersection<U> = (U extends U ? (x: U) => unknown : never) extends (
  x: infer R,
) => unknown
  ? R
  : never;

// 提取可选类型
export type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never]: Obj[Key];
};

export type isRequired<Key extends keyof Obj, Obj> = {} extends Pick<Obj, Key> ? never : Key;
export type GetRequired<Obj extends Record<string, any>> = {
  [Key in keyof Obj as isRequired<Key, Obj>]: Obj[Key];
};

// 去除索引签名
export type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

// 添加索引签名
export type AddIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key];
} & { [Key: string]: any };

// 对 A、B 两个索引类型做合并，如果是只有 A 中有的不变，如果是 A、B 都有的就变为可选，只有 B 中有的也变为可选
export type Defaultize<A, B> = Pick<A, Exclude<keyof A, keyof B>> &
  Partial<Pick<A, Extract<keyof A, keyof B>>> &
  Partial<Pick<B, Exclude<keyof B, keyof A>>>;

// 指定key转换为可选
export type PartialObjectPropByKeys<
  Obj extends Record<string, any>,
  Key extends keyof any = keyof Obj,
> = Copy<Partial<Pick<Obj, Extract<keyof Obj, Key>>> & Omit<Obj, Key>>;

// 下划线转驼峰
export type CamelCase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
  : Str;
//#endregion

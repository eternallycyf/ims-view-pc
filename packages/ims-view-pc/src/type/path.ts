declare const emptyObjectSymbol: unique symbol;
export type EmptyObject = { [emptyObjectSymbol]?: never };

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | void | Date | RegExp;

export type NonRecursiveType = BuiltIns | Function | (new (...args: any[]) => unknown);
export type ToString<T> = T extends string | number ? `${T}` : never;
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type UnknownArray = readonly unknown[];
/**
Return the part of the given array with a fixed index.

@example
```
type A = [string, number, boolean, ...string[]];
type B = FilterFixedIndexArray<A>;
//=> [string, number, boolean]
```
*/
type FilterFixedIndexArray<
  T extends UnknownArray,
  Result extends UnknownArray = [],
> = number extends T['length']
  ? T extends readonly [infer U, ...infer V]
    ? FilterFixedIndexArray<V, [...Result, U]>
    : Result
  : T;

/**
Return the part of the given array with a non-fixed index.

@example
```
type A = [string, number, boolean, ...string[]];
type B = FilterNotFixedIndexArray<A>;
//=> string[]
```
*/
type FilterNotFixedIndexArray<T extends UnknownArray> = T extends readonly [
  ...FilterFixedIndexArray<T>,
  ...infer U,
]
  ? U
  : [];

/**
Generate a union of all possible paths to properties in the given object.

It also works with arrays.

Use-case: You want a type-safe way to access deeply nested properties in an object.

@example
```
import type {Paths} from 'type-fest';

type Project = {
	filename: string;
	listA: string[];
	listB: [{filename: string}];
	folder: {
		subfolder: {
			filename: string;
		};
	};
};

type ProjectPaths = Paths<Project>;
//=> 'filename' | 'listA' | 'listB' | 'folder' | `listA.${number}` | 'listB.0' | 'listB.0.filename' | 'folder.subfolder' | 'folder.subfolder.filename'

declare function open<Path extends ProjectPaths>(path: Path): void;

open('filename'); // Pass
open('folder.subfolder'); // Pass
open('folder.subfolder.filename'); // Pass
open('foo'); // TypeError

// Also works with arrays
open('listA.1'); // Pass
open('listB.0'); // Pass
open('listB.1'); // TypeError. Because listB only has one element.
```

@category Object
@category Array
*/
export type Paths<T> = T extends
  | NonRecursiveType
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  ? never
  : IsAny<T> extends true
  ? never
  : T extends UnknownArray
  ? number extends T['length']
    ? // We need to handle the fixed and non-fixed index part of the array separately.
      | InternalPaths<FilterFixedIndexArray<T>>
        | InternalPaths<Array<FilterNotFixedIndexArray<T>[number]>>
    : InternalPaths<T>
  : T extends object
  ? InternalPaths<T>
  : never;

export type InternalPaths<_T, T = Required<_T>> = T extends EmptyObject | readonly []
  ? never
  : {
      [Key in keyof T]: Key extends string | number // Limit `Key` to string or number.
        ? // If `Key` is a number, return `Key | `${Key}``, because both `array[0]` and `array['0']` work.
          | Key
            | ToString<Key>
            | (IsNever<Paths<T[Key]>> extends false ? `${Key}.${Paths<T[Key]>}` : never)
        : never;
    }[keyof T & (T extends UnknownArray ? number : unknown)];

// array path
type DistributedKeyof<Target> = Target extends any ? keyof Target : never;

type DistributedAccess<Target, Key> = Target extends any
  ? Key extends keyof Target
    ? Target[Key]
    : undefined
  : never;

type Leaf = Date | boolean | string | number | symbol | bigint;

type DepthCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * @example
 * type SomeType = {
 *   name: string;
 *   nested: {
 *   value: number;
 *  };
 * };
 * type p = ObjectPaths<SomeType>;
 * type p = ["name"] | ["nested"] | ["nested", "value"]
 */
export type ObjectPaths<Target, Depth extends DepthCounter[number] = 10> = Depth extends never
  ? never
  : Target extends never
  ? never
  : Target extends Leaf
  ? never
  : {
      [Key in string & DistributedKeyof<Target>]:
        | [Key]
        | (NonNullable<DistributedAccess<Target, Key>> extends (infer ArrayItem)[]
            ?
                | [Key, number]
                | (ObjectPaths<ArrayItem, DepthCounter[Depth]> extends infer V extends any[]
                    ? [Key, number, ...V]
                    : never)
            : ObjectPaths<
                NonNullable<DistributedAccess<Target, Key>>,
                DepthCounter[Depth]
              > extends infer V extends any[]
            ? [Key, ...V]
            : never);
    }[string & DistributedKeyof<Target>];

// simple ObjectPaths
// type Paths<T, K extends keyof T = keyof T> = K extends K
//   ? [
//       K,
//       ...{
//         0: [];
//         1: [] | Paths<T[K]>;
//       }[T[K] extends string | number | boolean ? 0 : 1],
//     ]
//   : never;

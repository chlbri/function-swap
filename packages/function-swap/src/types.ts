import type { Decompose, Ru } from '@bemedev/decompose';

export interface ObjectFromMap<T extends string> {
  [key: string]: ObjectFrom<T>;
}

export type ObjectFrom<T extends string> = T | ObjectFromMap<T>;

export type AnyFunction = (...args: any[]) => any;

type RemovePoint<T> = T extends `.${infer U}` ? U : never;

type _DecomposedKeys<T> = Extract<
  RemovePoint<keyof Decompose<T, { object: 'both'; key: '.' }>>,
  string
>;

export type DecomposedKeys<F extends AnyFunction> = _DecomposedKeys<
  Parameters<F>
>;

export type DecomposedMap<F extends AnyFunction> = Decompose<
  Parameters<F>
>;

export type ResolveObjectFrom<P, D> = P extends string
  ? `.${P}` extends infer U extends keyof D
    ? D[U]
    : never
  : P extends Record<string, any>
    ? { [K in keyof P]: ResolveObjectFrom<P[K], D> }
    : never;

export type ResolveParamArray<P extends readonly any[], D> = {
  [I in keyof P]: ResolveObjectFrom<P[I], D>;
};

export type FunctionSwapLevel2<F extends AnyFunction> = <
  const P extends readonly ObjectFrom<DecomposedKeys<F>>[],
>(
  ...paramArray: P
) => (...args: ResolveParamArray<P, DecomposedMap<F>>) => ReturnType<F>;

export type FunctionSwap = <const F extends AnyFunction>(
  fn: F,
) => FunctionSwapLevel2<F>;

export type FunctionSwapObject = <P extends Ru>() => <
  const A extends readonly ObjectFrom<_DecomposedKeys<P>>[],
>(
  ...args: A
) => <
  const T extends (...args: ResolveParamArray<A, Decompose<P>>) => any,
>(
  fn: T,
) => T;

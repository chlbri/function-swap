import type { Decompose } from '@bemedev/decompose';

export interface ObjectFromMap<T extends string> {
  [key: string]: ObjectFrom<T>;
}

export type ObjectFrom<T extends string> = T | ObjectFromMap<T>;

export type AnyFunction = (...args: any[]) => any;

type RemovePoint<T> = T extends `.${infer U}` ? U : never;

type _Decompose<T> =
  Decompose<T, { object: 'key'; key: '.' }> extends infer U
    ? {
        [K in keyof U as RemovePoint<K & string>]: U[K];
      }
    : never;
type _DecomposedKeys<T> = Extract<keyof _Decompose<T>, string>;

// #region SubType
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type SubType<Base extends object, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;
// #endregion

export type DecomposeString2<T, Decomposed> =
  _Decompose<T> extends infer U
    ? {
        [K in keyof U]: AllowedNames<Decomposed, U[K]>;
      }
    : never;

export type DecomposedKeys<F extends AnyFunction> = _DecomposedKeys<
  Parameters<F>
>;

export type DecomposedMap<F extends AnyFunction> = Decompose<
  Parameters<F>
>;

export type ResolveObjectFrom<P, D> =
  `.${P & string}` extends infer U extends keyof D
    ? D[U]
    : P extends Record<string, any>
      ? { [K in keyof P]: ResolveObjectFrom<P[K], D> }
      : never;

export type ResolveParamArray<P extends readonly any[], D> = {
  [I in keyof P]: ResolveObjectFrom<P[I], D>;
};

export type FunctionSwapLevel2<F extends AnyFunction> = {
  <const P extends readonly ObjectFrom<DecomposedKeys<F>>[]>(
    ...paramArray: P
  ): (...args: ResolveParamArray<P, DecomposedMap<F>>) => ReturnType<F>;
  constraint: <P extends readonly any[]>() => <
    const P1 extends DecomposeString2<P, _Decompose<Parameters<F>>>,
  >(
    data: P1,
  ) => (...args: P) => ReturnType<F>;
};

export type FunctionSwap = <const F extends AnyFunction>(
  fn: F,
) => FunctionSwapLevel2<F>;

export type FunctionSwapParams = <P>() => <
  const A extends readonly ObjectFrom<_DecomposedKeys<P>>[],
>(
  ...args: A
) => <
  const T extends (...args: ResolveParamArray<A, Decompose<P>>) => any,
>(
  fn: T,
) => T;

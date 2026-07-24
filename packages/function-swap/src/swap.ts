import { recompose } from '@bemedev/decompose';
import { buildMap } from './helpers';
import type {
  AnyFunction,
  FunctionSwap,
  FunctionSwapObject,
} from './types';

const _swap: FunctionSwap = fn => {
  return ((...map: any[]) => {
    return (...newArgs: any[]) => {
      const decomposedMap = buildMap(map, newArgs);
      const recomposedArgs = recompose(decomposedMap) as any;
      return fn(...recomposedArgs);
    };
  }) as any;
};

export const swap = <const T extends AnyFunction>(fn: T) => _swap(fn);
swap.fromFunction = _swap;
swap.fromFn = _swap;
swap.fromObject = (() => () => b => b) as FunctionSwapObject;

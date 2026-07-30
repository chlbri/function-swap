import { getByKey, recompose } from '@bemedev/decompose';
import { buildMap } from './helpers';
import type {
  AnyFunction,
  FunctionSwap,
  FunctionSwapParams,
} from './types';

const _swap: FunctionSwap = fn => {
  const out: any = (...map: any[]) => {
    return (...newArgs: any[]) => {
      const decomposedMap = buildMap(map, newArgs);
      if (Object.keys(decomposedMap).length === 0) return fn();
      const recomposedArgs = recompose(decomposedMap) as any;
      return fn(...recomposedArgs);
    };
  };

  out.constraint = () => (keysMatch: Record<string, string>) => {
    return (...newArgs: any[]) => {
      if (Object.keys(keysMatch).length === 0) return fn();
      const decomposedMap: Record<string, any> = {};

      for (const [keyF, keyP] of Object.entries(keysMatch)) {
        decomposedMap[keyF] = getByKey(newArgs, keyP);
      }

      const recomposedArgs = recompose(decomposedMap) as any;
      return fn(...recomposedArgs);
    };
  };

  return out;
};

export const swap = <const T extends AnyFunction>(fn: T) => _swap(fn);
swap.fromFunction = _swap;
swap.fromFn = _swap;
swap.fromParameters = (() => () => b => b) as FunctionSwapParams;
swap.fromParams = swap.fromParameters;

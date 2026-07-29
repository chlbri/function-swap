import type { Decompose } from '@bemedev/decompose';
import type { AnyFunction, DecomposeString } from './types';

const subtract = (a: number, b: number) => a - b;
expectTypeOf<typeof subtract>().toExtend<AnyFunction>();

type _Complex1 = {
  // fn: (num: number) => any;
  array: [number, string, boolean, { body: any; age: number }];
  body: any;
};

type DS1 = DecomposeString<
  _Complex1,
  Decompose<{ name: string; age: number }, { object: 'key'; start: false }>
>;

expectTypeOf<DS1>().toEqualTypeOf<{
  name: 'body' | 'array.[1]' | 'array.[3].body';
  age: 'body' | 'array.[0]' | 'array.[3].age' | 'array.[3].body';
}>();

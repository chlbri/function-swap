# @bemedev/function-swap

A TypeScript utility that lets you remap a function's parameters by
swapping their order or decomposing them into named keys — without changing
the original function signature.

<br/>

## Installation

```bash
pnpm add @bemedev/function-swap
pnpm add -P @bemedev/decompose # Peer dependency
```

> [!NOTE] `@bemedev/decompose` is a peer dependency of
> `@bemedev/function-swap` and must be installed in your project.

<br/>

## Usage

```ts
import { swap } from '@bemedev/function-swap';

// Original function: (a, b, c) => string
const greet = (first: string, last: string, title: string) =>
  `${title} ${first} ${last}`;

// Remap: call as (title, last, first) instead
const swappedGreet = swap(greet)('[2]', '[1]', '[0]');

swappedGreet('Dr.', 'Smith', 'John'); // => "Dr. John Smith"
```

### Aliases

```ts
import { swap } from '@bemedev/function-swap';

swap.fromFunction(fn); // same as swap(fn)
swap.fromFn(fn); // same as swap(fn)
```

### `swap.fromParameters` / `swap.fromParams`

`swap.fromParameters` (or `swap.fromParams`) is the **type-first** variant.
Instead of wrapping an existing function, you declare the target
**parameter shape** `P` as a tuple type parameter, then provide decomposed
key selectors, and finally pass in the implementation function.

```
swap.fromParams<P>()(...keys)(fn) => fn
```

| Step        | What you provide                               | What you get             |
| ----------- | ---------------------------------------------- | ------------------------ |
| `<P>()`     | Tuple parameter type `P` as a generic          | A key-selector builder   |
| `(...keys)` | Decomposed key strings / nested maps           | A typed function builder |
| `(fn)`      | Implementation matching the resolved signature | The function `fn`        |

**Example — build a typed function over parameter shapes:**

```ts
import { swap } from '@bemedev/function-swap';

type UserParam = [{ data: string; age: number }, number];

// Select target parameter paths
const swapFn = swap.fromParams<UserParam>()('[1]', '[0].data', '[0].age');

const fn = swapFn(
  (length, data, age) => `${length}:${data.toUpperCase()}-${age * 2}`,
);

fn(5, 'alice', 30); // => "5:ALICE-60"
```

### `swap(fn).constraint`

`swap(fn).constraint` lets you define explicit parameter maps between
target input parameter types `P` and source function parameters.

```ts
import { swap } from '@bemedev/function-swap';

const subtract = (a: number, b: number) => a - b;

// Swap arguments [0] and [1] with a constraint map
const swappedSubtract = swap(subtract).constraint<[number, number]>()({
  '[0]': '[1]',
  '[1]': '[0]',
});

swappedSubtract(2, 10); // => 8 (10 - 2)
```

> [!NOTE] `DecomposeString2` is **not partial** at runtime. Even though
> TypeScript optional property syntax (`?`) allows omitting keys in the
> constraint mapping object, all decomposed keys required by the target
> function must be mapped. Omitting required keys will result in
> `undefined` values during argument recomposition and will fail at runtime
> if the target function expects them.

<br/>

## Exported Types

`@bemedev/function-swap` exports the following utility types and function
signatures:

### Core Function & Builder Types

- **`AnyFunction`**: Generic function signature type
  `(...args: any[]) => any`.
- **`FunctionSwap`**: Function signature for `swap(fn)`.
- **`FunctionSwapLevel2<F>`**: Return type of `swap(fn)` providing
  key-selector mapping and `.constraint<P>()`.
- **`FunctionSwapParams`**: Function signature for `swap.fromParameters` /
  `swap.fromParams`.

### Parameter Selection & Mapping Types

- **`ObjectFrom<T extends string>`**: Union type of string key path `T` or
  nested key map `ObjectFromMap<T>`.
- **`ObjectFromMap<T extends string>`**: Recursive dictionary mapping
  string keys to `ObjectFrom<T>`.
- **`ResolveObjectFrom<P, D>`**: Resolves argument type from key selector
  `P` using decomposed map `D`.
- **`ResolveParamArray<P, D>`**: Maps tuple of key selectors `P` to
  resolved parameter types.

### Decomposition & Helper Types

- **`Decompose<T>`**: Decomposes object or tuple type `T` into
  dot-separated key-value pairs (with leading dot removed).
- **`DecomposedKeys<T>`**: Extracts all string key paths resulting from
  decomposing type `T`.
- **`DecomposedParameterKeys<F>`**: Helper extracting decomposed key paths
  from parameters of function `F`.
- **`DecomposedMap<F>`**: Raw decomposed type representation of parameters
  of function `F`.
- **`AllowedNames<Base, Condition>`**: Filters property keys of `Base`
  matching type `Condition`.
- **`SubType<Base, Condition>`**: Constructs a subtype of `Base` containing
  only properties matching type `Condition`.
- **`DecomposeString2<T, Decomposed>`**: Maps decomposed target parameter
  key paths to matching source key paths. _Note: Not partial at runtime._

<br/>

## Licence

MIT

## CHANGE_LOG

Read [CHANGELOG.md](CHANGELOG.md) for more details about the changes.

<br/>

## Auteur

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Liens

- [Documentation](https://github.com/chlbri/function-swap)

import { swap } from './swap';
import { createTests } from '@bemedev/dev-utils/vitest-extended';

describe('TESTS', () => {
  const subtract = (a: number, b: number) => a - b;
  const swappedSubtract = swap(subtract)('[1]', '[0]');
  const concat = (a: number, b: string) => `${a}-${b}`;
  const swappedConcat = swap(concat)('[1]', '[0]');
  const format = (a: number, b: string) => `${a * 2}:${b.toUpperCase()}`;
  const swappedFmtObjArr = swap(format)({ num: '[0]' }, '[1]');

  const swappedFmtObj = swap.fromFunction(format)({
    num: '[0]',
    str: '[1]',
  });

  test('#01 => subtract(10, 2) is 8', () => {
    expect(subtract(10, 2)).toBe(8);
  });

  test('#02 => swappedSubtract(2, 10) is 8', () => {
    expect(swappedSubtract(2, 10)).toBe(8);
  });

  test('#03 => concat(42, "hello") is "42-hello"', () => {
    expect(concat(42, 'hello')).toBe('42-hello');
  });

  test('#04 => swappedConcat("hello", 42) is "42-hello"', () => {
    expect(swappedConcat('hello', 42)).toBe('42-hello');
  });

  test('#05 => format(5, "hi") is "10:HI"', () => {
    expect(format(5, 'hi')).toBe('10:HI');
  });

  test('#06 => swappedFmtObj({ num: 5, str: "hi" }) is "10:HI"', () => {
    expect(swappedFmtObj({ num: 5, str: 'hi' })).toBe('10:HI');
  });

  test('#07 => swappedFmtObjArr({ num: 5}, "hi") is "10:HI"', () => {
    expect(swappedFmtObjArr({ num: 5 }, 'hi')).toBe('10:HI');
  });

  describe('#08 => swap.fromObject', () => {
    const swap1 = swap.fromObject<{ data: string; age: number }>();

    test('#01 => complex', () => {
      const fn = swap1(
        'age',
        'data',
      )((age, data) => `${age * 2}:${data.toUpperCase()}`);
      expect(fn(5, 'hi')).toBe('10:HI');
    });

    test('#02 => Hello world !', () => {
      const fn = swap1('data')(data => `Hello ${data}`);
      expect(fn('Brian')).toBe('Hello Brian');
    });

    describe('#03 => exponent', () => {
      const fn = swap1('age')(age => age ** age);

      const { acceptation, success } = createTests(fn);

      describe('#00 => Acceptation', acceptation);
      describe(
        '#01 => CASES',
        success(
          { invite: '2 ** 2 is 4', parameters: 2, expected: 4 },
          { invite: '3 ** 3 is 27', parameters: 3, expected: 27 },
          { invite: '4 ** 4 is 256', parameters: 4, expected: 256 },
          { invite: '5 ** 5 is 3125', parameters: 5, expected: 3125 },
        ),
      );
    });
  });

  describe('#08 => Edge cases', () => {
    const _fn1 = (a: number, b: number, c: number) => a + b * 2 + c;
    const fn1 = swap(_fn1)({
      value1: '[0]',
      composite: { value2: '[1]' },
      value3: '[2]',
    });

    const { acceptation, success } = createTests(fn1);

    describe('#00 => Acceptation', acceptation);
    describe(
      '#01 => CASES',
      success(
        {
          invite: 'fn(1,2,3) => 8',
          parameters: { value1: 1, composite: { value2: 2 }, value3: 3 },
          expected: 8,
        },
        {
          invite: 'fn(1,2,4) => 9',
          parameters: { value1: 1, composite: { value2: 2 }, value3: 4 },
          expected: 9,
        },
      ),
    );
  });
});

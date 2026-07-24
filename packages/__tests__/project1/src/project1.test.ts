import todo from '@bemedev/function-swap';

describe('project1 tests', () => {
  test('runs core todo function', () => {
    expect(todo()).toBe('todo');
  });
});

const sleep = require('../sleep');

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('sleep.', () => {
  test('should be a function.', () => {
    expect(typeof sleep).toBe('function');
  });

  test('should return a promise.', () => {
    expect(sleep(200)).toBeInstanceOf(Promise);
  });

  test('should call setTimeout.', () => {
    sleep(200);

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });
});

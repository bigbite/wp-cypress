const asyncMap = require('../async-map');

describe('asyncMap.', () => {
  test('should be a function.', () => {
    expect(typeof asyncMap).toBe('function');
  });

  test('should return a promise.', () => {
    expect(asyncMap([1], jest.fn())).toBeInstanceOf(Promise);
  });

  test('should call function for each array value.', () => {
    expect.assertions(3);

    const values = [1, 2, 3];

    asyncMap(values, (num) => {
      expect(num).toBeOneOf(values);
    });
  });

  test('should return sum of values from callback.', () => {
    expect.assertions(1);
    const values = [1, 2, 3];

    asyncMap(values, (num) => {
      return num * 2;
    }).then((result) => {
      expect(result).toEqual([2, 4, 6]);
    });
  });
});

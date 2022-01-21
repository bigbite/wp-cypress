const isUnixHiddenPath = require('../is-unix-hidden-path');

describe('isUnixHiddenPath.', () => {
  test('should be a function.', () => {
    expect(typeof isUnixHiddenPath).toBe('function');
  });

  test('should return true.', () => {
    expect(isUnixHiddenPath('./.test/path/')).toBeTrue();
  });

  test('should return true.', () => {
    expect(isUnixHiddenPath('./test/path/')).not.toBeTrue();
  });
});

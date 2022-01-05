const watchDir = require('../watch-dir');
const mock = require('mock-fs');
const fs = require('fs');

describe('watchDir', () => {
  beforeEach(() => {
    mock({
      'src/dir': {
        'test-file-001': 'First Test File',
        'test-file-002': 'Second Test File',
        'sub-dir': {
          'test-file-003': 'Third Test File',
        },
      },
      'dest/dir': {},
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test('should be a function.', () => {
    expect(typeof watchDir).toBe('function');
  });

  test('callback should fire with load event.', () => {
    const callback = jest.fn();

    const watcher = watchDir('src/', callback);

    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe('load');
    expect(callback.mock.calls[0][1]).toBe('src/');

    watcher.close();
  });

  test('callback should fire all event after addition.', async () => {
    const callback = jest.fn();

    const watcher = watchDir('src/', callback);
    // Simulate an addition by directly emitting an event.
    await watcher.emit('all', 'add', 'src/dir/created-file-001');

    expect(callback.mock.calls.length).toBe(2);
    expect(callback.mock.calls[1][0]).toBe('add');
    expect(callback.mock.calls[1][1]).toBe('src/dir/created-file-001');

    watcher.close();
  });

  test('callback should not fire all if path not set.', async () => {
    const callback = jest.fn();

    const watcher = watchDir('src/', callback);
    // Simulate an addition by directly emitting an event.
    await watcher.emit('all', 'add', null);

    expect(callback.mock.calls.length).toBe(1);

    watcher.close();
  });
});

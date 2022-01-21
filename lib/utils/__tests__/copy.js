const fs = require('fs');
const mock = require('mock-fs');
const { copyDirSync, copyFileSync } = require('../copy');

describe('copy', () => {
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

  describe('copyFileSync', () => {
    test('should be a function.', () => {
      expect(typeof copyFileSync).toBe('function');
    });

    test('should write to file.', () => {
      copyFileSync('src/dir/test-file-001', 'dest/dir/test-file-001');
      expect(fs.readdirSync('dest/dir/').length).toBe(1);
    });

    test('should modify and write to file.', () => {
      const modifierMock = jest.fn(() => 'modified content');

      copyFileSync('src/dir/test-file-001', 'dest/dir/test-file-001', modifierMock);
      expect(fs.readdirSync('dest/dir/').length).toBe(1);
      expect(fs.readFileSync('dest/dir/test-file-001', 'utf-8')).toEqual('modified content');
    });
  });

  describe('copyDirSync', () => {
    test('should be a function.', () => {
      expect(typeof copyDirSync).toBe('function');
    });

    test('should write to directory.', () => {
      copyDirSync('src/dir/', 'dest/dir/');
      expect(fs.readdirSync('dest/dir/').length).toBe(3);
    });

    test('should not copy if filter matches.', () => {
      copyDirSync('src/dir/', 'dest/dir/', false, ['src/']);
      expect(fs.readdirSync('dest/dir/').length).toBe(0);
    });

    test('should not copy if src is not a directory.', () => {
      copyDirSync('src/dir/test-file-001', 'dest/dir/');
      expect(fs.readdirSync('dest/dir/').length).toBe(0);
    });

    test('should copy subdirectories and its contents.', () => {
      copyDirSync('src/dir/', 'dest/dir/');
      expect(fs.readdirSync('dest/dir/sub-dir').length).toBe(1);
    });
  });
});

const getBaseUrl = require('../getBaseUrl');

describe('getBaseUrl', () => {
  test('should be a function.', () => {
    expect(typeof getBaseUrl).toBe('function');
  });
  test('should use default port if none provided', () => {
    const config = {};
    expect(getBaseUrl(config)).toBe('http://localhost');
  });
  test('should use provided port number', () => {
    const port = 8080;
    const config = {
      port,
    };
    expect(getBaseUrl(config)).toBe(`http://localhost:${port}`);
  });
  test('should use default SSL port if sslCertificate is provided but sslPort is not provided', () => {
    const port = 8080;
    const config = {
      sslCertificate: {
        cert: './localhost.pem',
        key: './localhost-key.pem',
      },
      port,
    };
    expect(getBaseUrl(config)).toBe('https://localhost:4433');
  });
  test('should use provided SSL port number if sslCertificate and sslPort is provided', () => {
    const port = 8080;
    const sslPort = 3433;
    const config = {
      sslCertificate: {
        cert: './localhost.pem',
        key: './localhost-key.pem',
      },
      port,
      sslPort,
    };
    expect(getBaseUrl(config)).toBe(`https://localhost:${sslPort}`);
  });
});

const getBaseUrl = (config) => {
  if (config.sslCertificate) {
    return config.sslPort ? `https://localhost:${config.sslPort}` : 'https://localhost:4433';
  }
  return config.port ? `http://localhost:${config.port}` : 'https://localhost';
};

module.exports = getBaseUrl;

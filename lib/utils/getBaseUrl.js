/**
 * Uses the Cypress config option to return the correct base URL.
 *
 * @param {object} config the Cypress config object
 * @returns the base URL
 */
const getBaseUrl = (config) => {
  if (config.sslCertificate) {
    return config.sslPort ? `https://localhost:${config.sslPort}` : 'https://localhost:4433';
  }
  return config.port ? `http://localhost:${config.port}` : 'http://localhost';
};

module.exports = getBaseUrl;

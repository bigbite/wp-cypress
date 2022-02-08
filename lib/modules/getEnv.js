const getEnv = (name) =>
  // All env vars will be prefixed with `WP_CYPRESS_`
  process.env[`WP_CYPRESS_${name}`];
module.exports = {
  getEnv,
};

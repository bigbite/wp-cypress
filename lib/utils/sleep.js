/**
 * Sleep for a period of milliseconds.
 *
 * @param {number} ms
 *
 * @return {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = sleep;

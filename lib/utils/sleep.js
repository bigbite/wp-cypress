/**
 * Sleep for a period of milliseconds.
 *
 * @param {number} ms
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = sleep;

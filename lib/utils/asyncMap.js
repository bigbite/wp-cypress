/**
 * Async version of array map
 *
 * @param {array} array - Items to iterate
 * @param {promise} promise - Promise to exec
 *
 * @returns {promise<array>}
 */
const asyncMap = async (array, promise) => {
  const promises = array.map(async (x) => {
    const result = await promise(x);
    return result;
  });

  const results = await Promise.all(promises);

  return results;
};

module.exports = asyncMap;

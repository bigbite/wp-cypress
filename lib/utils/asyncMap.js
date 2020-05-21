const asyncMap = async (array, promise) => {
  const promises = array.map(async (x) => {
    const result = await promise(x);
    return result;
  });

  const results = await Promise.all(promises);

  return results;
};

module.exports = asyncMap;

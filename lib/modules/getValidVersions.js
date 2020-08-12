const asyncMap = require('../utils/asyncMap');

const verifyWPVersion = require('./verifyWPVersion');

const getValidVersions = async (versions) => {
  const validation = await asyncMap(versions, async (ver) => {
    const valid = await verifyWPVersion(ver);
    return { ver, valid };
  });

  return validation.filter((x) => x.valid).map((x) => x.ver);
};

module.exports = getValidVersions;

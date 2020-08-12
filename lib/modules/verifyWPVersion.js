const fetch = require('node-fetch');

const verifyWPVersion = async (version) => {
  const res = await fetch(`https://en-gb.wordpress.org/wordpress-${version}-en_GB.zip.md5`);
  const body = await res.text();

  if (body === 'Release not found.') {
    return false;
  }

  return true;
};

module.exports = verifyWPVersion;

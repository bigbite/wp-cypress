const getWPInstallType = (multisite) => {
  if (multisite === 'subdomain') {
    return 'multisite-install --subdomains';
  }

  if (multisite) {
    return 'multisite-install';
  }

  return 'install';
};

module.exports = getWPInstallType;

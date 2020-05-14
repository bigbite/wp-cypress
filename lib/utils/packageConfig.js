const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const writeFile = async (file, data) => fsp.writeFile(file, JSON.stringify(data), 'utf8');

module.exports = async (config = false) => {
  const store = {};

  const dir = path.resolve(`${__dirname}/../../`);
  const filename = 'config';

  store.path = `${dir}/${filename}.json`;

  const dirExists = fs.existsSync(dir);

  if (!dirExists) {
    await fsp.mkdir(dir);
  }

  const fileExists = fs.existsSync(store.path);

  if (config || !fileExists) {
    await writeFile(store.path, config || {});
  }

  store.save = async (key, value) => {
    const data = await fsp.readFile(store.path, 'utf8');
    const obj = JSON.parse(data);
    obj[key] = value;
    await writeFile(store.path, obj);
  };

  store.get = async (key = false) => {
    const data = await fsp.readFile(store.path, 'utf8');
    const obj = JSON.parse(data);
    if (!key) {
      return obj;
    }

    return obj[key];
  };

  return store;
};

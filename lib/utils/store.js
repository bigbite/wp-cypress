const fs = require('fs');
const fsp = require('fs').promises;

const writeFile = async (path, data) => fsp.writeFile(path, JSON.stringify(data), 'utf8');

module.exports = async (dir, filename) => {
  const store = {};
  store.path = `${dir}/${filename}.json`;

  const dirExists = fs.existsSync(dir);

  if (!dirExists) {
    await fsp.mkdir(dir);
  }

  const fileExists = fs.existsSync(store.path);

  if (!fileExists) {
    await writeFile(store.path, {});
  }

  store.save = async (key, value) => {
    const data = await fsp.readFile(store.path, 'utf8');
    const obj = JSON.parse(data);
    obj[key] = value;
    await writeFile(store.path, obj);
  };

  store.get = async (keys = []) => {
    const data = await fsp.readFile(store.path, 'utf8');
    const obj = JSON.parse(data);
    if (keys.length === 0) {
      return obj;
    }
    return keys.map((key) => obj[key]);
  };

  return store;
};

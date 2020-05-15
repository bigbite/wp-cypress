const fs = require('fs');
const path = require('path');

const copyFileSync = (source, target, fileModifier) => {
  let targetFile = target;

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, `${path.basename(source)}`);
    }
  }

  let fileContents = fs.readFileSync(source, { encoding: 'utf8' });

  if (fileModifier) {
    fileContents = fileModifier(fileContents);
  }

  fs.writeFileSync(targetFile, fileContents);
};

const copyFolderRecursiveSync = (source, target, fileModifier = false) => {
  const targetFolder = path.join(target, path.basename(source));

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);

    files.forEach((file) => {
      const currentSource = path.join(source, file);

      if (fs.lstatSync(currentSource).isDirectory()) {
        copyFolderRecursiveSync(currentSource, targetFolder, fileModifier);
      } else {
        copyFileSync(currentSource, targetFolder, fileModifier);
      }
    });
  }
};

module.exports = copyFolderRecursiveSync;

const fs = require('fs-extra');
const ejs = require('ejs');

const renderTemplate = async (templatePath, outputPath, data) => {
  const file = await ejs.renderFile(templatePath, data, { async: true });
  await fs.outputFile(outputPath, file);
};

module.exports = renderTemplate;

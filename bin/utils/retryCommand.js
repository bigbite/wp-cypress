const sleep = require('./sleep');

const retryCommand = async (command, delay, times) => {
  const output = await command();

  if (output.code === 1 && times > 0) {
    await sleep(delay);
    return retryCommand(command, delay, times - 1);
  }

  return output;
};

module.exports = retryCommand;

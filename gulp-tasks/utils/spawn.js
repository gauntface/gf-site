const spawn = require('child_process').spawn;

module.exports = (cmd, cmdFlags, ...options) => {
  return new Promise((resolve, reject) => {
    let errString = '';
    const dockerProcess = spawn(cmd, cmdFlags, options);

    dockerProcess.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    dockerProcess.stderr.on('data', (data) => {
      errString += data.toString();
    });

    dockerProcess.on('exit', (code) => {
      if (code !== 0) {
        return reject(errString);
      }

      resolve();
    });
  });
};

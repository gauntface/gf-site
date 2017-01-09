const fetch = require('node-fetch');

module.exports = (serverUrl, timeout) => {
  return new Promise((resolve, reject) => {
    let promiseSettled = false;

    const timeoutID = setTimeout(() => {
      if (promiseSettled) {
        return;
      }

      promiseSettled =true;
      reject(new Error(`Unable to ascertain good server state before timeout.`));
    }, timeout);

    const checkOkStatus = () => {
      if (promiseSettled) {
        return;
      }

      fetch(`${serverUrl}/ok`)
      .catch(() => {
        return null;
      })
      .then((response) => {
        if (promiseSettled) {
          return;
        }

        if (response && response.ok) {
          promiseSettled = true;
          clearTimeout(timeoutID);
          return resolve();
        }

        checkOkStatus();
      });
    };

    checkOkStatus();
  });
};

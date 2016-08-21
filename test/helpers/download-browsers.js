const seleniumAssistant = require('selenium-assistant');

Promise.all([
  seleniumAssistant.downloadBrowser('chrome', 'stable')
])
.then(() => {
  console.log('Browser download complete.');
});

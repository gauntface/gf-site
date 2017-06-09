const seleniumAssistant = require('selenium-assistant');
const siteServer = require('../../build/site-server');

const timeoutPromise = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

describe('Test Styleguide Logic', function() {
  this.timeout(5 * 60 * 1000);
  this.retries(2);

  const desiredPort = 3002;
  const serverUrl = `http://localhost:${desiredPort}`;

  const stepTimeout = 500;

  let globalDriver;

  before(function() {
    // 5 Minutes to download Chrome stable.
    this.timeout(5 * 60 * 1000);

    return seleniumAssistant.downloadLocalBrowser('chrome', 'stable', 48)
    .then(() => {
      return siteServer.start(desiredPort);
    });
  });

  after(function() {
    this.timeout(10 * 1000);

    return Promise.all([
      siteServer.stop(),
      seleniumAssistant.killWebDriver(globalDriver),
    ])
    .then(() => {
      globalDriver = null;
    });
  });

  it('should be able to loop through grid', function() {
    const chromeBrowser = seleniumAssistant.getLocalBrowser('chrome', 'stable');
    return chromeBrowser.getSeleniumDriver()
    .then((driver) => {
      globalDriver = driver;
    })
    .then(() => {
      return globalDriver.get(`${serverUrl}/styleguide`);
    })
    .then(() => {
      return timeoutPromise(stepTimeout);
    })
    .then(() => {
      return globalDriver.executeScript(function() {
        const gridBtn = document.querySelector('.js-styleguide-grid-btn');
        gridBtn.click();
      });
    })
    .then(() => {
      return globalDriver.wait(function() {
        return globalDriver.executeScript(function() {
          const styleguideIframe = document.querySelector('.js-styleguide-iframe');
          const gridOverlay = styleguideIframe.contentWindow.document.querySelector('.js-grid-overlay');
          return gridOverlay.classList.contains('is-enabled');
        });
      });
    })
    .then(() => {
      return globalDriver.wait(function() {
        return globalDriver.executeScript(function() {
          const styleguideIframe = document.querySelector('.js-styleguide-iframe');
          const gridOverlay = styleguideIframe.contentWindow.document.querySelector('.js-grid-overlay');
          return gridOverlay.classList.contains('dark');
        });
      });
    })
    .then(() => {
      return timeoutPromise(stepTimeout);
    })
    .then(() => {
      return globalDriver.executeScript(function() {
        const gridBtn = document.querySelector('.js-styleguide-grid-btn');
        gridBtn.click();
      });
    })
    .then(() => {
      return globalDriver.wait(function() {
        return globalDriver.executeScript(function() {
          const styleguideIframe = document.querySelector('.js-styleguide-iframe');
          const gridOverlay = styleguideIframe.contentWindow.document.querySelector('.js-grid-overlay');
          return gridOverlay.classList.contains('is-enabled');
        });
      });
    })
    .then(() => {
      return globalDriver.wait(function() {
        return globalDriver.executeScript(function() {
          const styleguideIframe = document.querySelector('.js-styleguide-iframe');
          const gridOverlay = styleguideIframe.contentWindow.document.querySelector('.js-grid-overlay');
          return gridOverlay.classList.contains('light');
        });
      });
    })
    .then(() => {
      return timeoutPromise(stepTimeout);
    })
    .then(() => {
      return globalDriver.executeScript(function() {
        const gridBtn = document.querySelector('.js-styleguide-grid-btn');
        gridBtn.click();
      });
    })
    .then(() => {
      return globalDriver.wait(function() {
        return globalDriver.executeScript(function() {
          const styleguideIframe = document.querySelector('.js-styleguide-iframe');
          const gridOverlay = styleguideIframe.contentWindow.document.querySelector('.js-grid-overlay');
          return !gridOverlay.classList.contains('is-enabled');
        });
      });
    })
    .then(() => {
      return timeoutPromise(stepTimeout);
    });
  });
});

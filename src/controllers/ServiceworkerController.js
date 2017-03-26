const fs = require('fs-promise');
const path = require('path');

class ServiceWorkerController {
  index() {
    return fs.readFile(
      path.join(__dirname, '..', 'static', 'scripts',
        'templates', 'serviceworker.tmpl.js'
      )
    )
    .then((templateBuffer) => {
      return templateBuffer.toString();
    })
    .then((template) => {
      template = template.replace(
        '/** @ GF-SWLIB-IMPORT @ **/',
        `importScripts('/third_party/sw-lib/sw-lib.v0.0.13.min.js')`
      );
      return template;
    });
  }
}

module.exports = new ServiceWorkerController();

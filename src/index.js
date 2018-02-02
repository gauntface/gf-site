/* eslint-disable no-console */
process.on('uncaughtException', (err) => {
  console.error(err);
  throw err;
});

process.on('unhandledRejection', (reason, p) => {
  console.err('Unhandled Rejection at:', p, 'reason:', reason);
  throw reason;
});
/* eslint-enable no-console */

const siteServer = require('./site-server');
siteServer.start(process.env.NODE_PORT);
/* eslint-disable no-console */
console.log(`Server started on http://localhost:${process.env.NODE_PORT}/`);
/* eslint-enable no-console */

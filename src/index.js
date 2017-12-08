const siteServer = require('./site-server');
siteServer.start(process.env.NODE_PORT);
/* eslint-disable no-console */
console.log(`Server started on http://localhost:${process.env.NODE_PORT}/`);
/* eslint-enable no-console */

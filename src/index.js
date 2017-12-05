const siteServer = require('./site-server');
siteServer.start(process.env.PORT);
/* eslint-disable no-console */
console.log(`Server started on http://localhost:${process.env.PORT}/`);
/* eslint-enable no-console */

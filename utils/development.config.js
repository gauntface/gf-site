const PORT = 5123;

module.exports = {
  url: `http://localhost:${PORT}`,
  port: PORT,
  database: {
    rootPassword: 'password',
    user: 'example-user',
    password: 'example-password',
    dbName: 'example-db',
  },
};

const PORT = 5123;

module.exports = {
  name: 'development',
  url: `http://localhost:${PORT}`,
  port: PORT,
  database: {
    rootPassword: 'development-password',
    user: 'development-user',
    password: 'development-password',
    database: 'development-db',
  },
};

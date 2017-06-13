const PORT = 5124;

module.exports = {
  name: 'testing',
  url: `http://localhost:${PORT}`,
  port: PORT,
  database: {
    rootPassword: 'testing-root-password',
    user: 'testing-user',
    password: 'testing-password',
    database: 'testing-db',
  },
};

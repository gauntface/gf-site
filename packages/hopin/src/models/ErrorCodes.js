module.exports = {
  'unknown-error': {
    message: (args) => `An unknown error was thrown with name: ` +
      `'${args.origCode}'.`,
  },
  'no-controller-found': {
    message: (args) => `No controller found for route: '${args.url}'.`,
  },
};

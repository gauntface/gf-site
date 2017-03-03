module.exports = {
  'unknown-error': {
    message: (args) => `An unknown error was thrown with name: ` +
      `'${args.origCode}'.`,
  },
  'no-controller-found': {
    message: (args) => `No controller found for route: '${args.url}'.`,
  },
  'template-not-found': {
    message: (args) => `Template not found: '${args.templatePath}'`,
  },
  'no-template-path': {
    message: `No 'templatePath' defined in TemplateManager constructor.`,
  },
  'shell-required': {
    message: `A shell value is a required parameter into renderHTML().`,
  },
};

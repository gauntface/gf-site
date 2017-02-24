const path = require('path');
const proxyquire = require('proxyquire').noCallThru();

describe('Controller Router.route()', function() {
  const exampleController = {
    indexCount: 0,
    demoCount: 0,
    lastType: null,
    index: ({type}) => {
      exampleController.lastType = type;
      exampleController.indexCount++;
    },
    demo: ({type}) => {
      exampleController.lastType = type;
      exampleController.demoCount++;
    },
    reset: () => {
      exampleController.lastType = null;
      exampleController.indexCount = 0;
      exampleController.demoCount = 0;
    },
  };

  const homeController = {
    indexCount: 0,
    lastType: null,
    index: ({type}) => {
      homeController.lastType = type;
      homeController.indexCount++;
    },
    reset: () => {
      homeController.lastType = null;
      homeController.indexCount = 0;
    },
  };

  const errorController = {
    indexCount: 0,
    lastType: null,
    index: ({type}) => {
      errorController.lastType = type;
      errorController.indexCount++;
    },
    reset: () => {
      errorController.lastType = null;
      errorController.indexCount = 0;
    },
  };

  const exampleControllerPath = path.join(__dirname, 'ExampleController.js');
  const homeControllerPath = path.join(__dirname, 'HomeController.js');
  const errorControllerPath = path.join(__dirname, 'ErrorController.js');
  const proxyquireInputs = {};
  proxyquireInputs['mz/fs'] = {
    exists: (filePath) => {
      if (filePath === exampleControllerPath) {
        return Promise.resolve(true);
      } else if (filePath === homeControllerPath) {
        return Promise.resolve(true);
      } else if (filePath === errorControllerPath) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    },
  };
  proxyquireInputs[exampleControllerPath] = exampleController;
  proxyquireInputs[homeControllerPath] = homeController;
  proxyquireInputs[errorControllerPath] = errorController;

  const Router = proxyquire('../../src/controllers/Router', proxyquireInputs);

  beforeEach(function() {
    exampleController.reset();
    homeController.reset();
  });

  it('should handle bad / non-url input', function() {
    const router = new Router({
      relativePath: __dirname,
    });
    const INJECTED_ERROR = 'Expected route to throw error.';
    try {
      router.route({});
      throw new Error(INJECTED_ERROR);
    } catch (err) {
      if (err.message === INJECTED_ERROR) {
        throw err;
      }
    }
  });

  it('should direct to home controller for /', function() {
    const router = new Router({
      relativePath: __dirname,
    });
    return router.route('/')
    .then(() => {
      if(homeController.indexCount !== 1) {
        throw new Error('Expected home controllers index function to be called');
      }
      if (homeController.lastType !== 'html') {
        throw new Error('Expected type to be html');
      }
    });
  });

  it('should direct to controller index by default', function() {
    const router = new Router({
      relativePath: __dirname,
    });
    return router.route('/example')
    .then(() => {
      if(exampleController.indexCount !== 1) {
        throw new Error('Expected example controllers index function to be called');
      }
      if (exampleController.lastType !== 'html') {
        throw new Error('Expected type to be html');
      }
    });
  });

  it('should direct to controller action', function() {
    const router = new Router({
      relativePath: __dirname,
    });
    return router.route('/example/demo')
    .then(() => {
      if(exampleController.demoCount !== 1) {
        throw new Error('Expected example controllers demo function to be called');
      }
      if (exampleController.lastType !== 'html') {
        throw new Error('Expected type to be html');
      }
    });
  });

  it('should direct to controller action with type', function() {
    const router = new Router({
      relativePath: __dirname,
    });
    return router.route('/example/demo.json')
    .then(() => {
      if(exampleController.demoCount !== 1) {
        throw new Error('Expected example controllers demo function to be called');
      }
      if (exampleController.lastType !== 'json') {
        throw new Error('Expected type to be json');
      }
    });
  });

  it('should pass non-existant controller requests to error controller', function() {
    const router = new Router({
      relativePath: __dirname,
    });
    return router.route('/bad-controller')
    .then(() => {
      if(errorController.indexCount !== 1) {
        throw new Error('Expected error controllers index function to be called');
      }
      if (errorController.lastType !== 'html') {
        throw new Error('Expected type to be html');
      }
    });
  });
});

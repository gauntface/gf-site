'use strict';

import BaseController from './base/base-controller';
import Debug from './debug';

class StandardPage extends BaseController {
  constructor () {
    super();

    super.onDOMContentLoaded(() => this.onDOMContentLoaded());
  }

  onDOMContentLoaded () {
    window.GauntFace.Debug = new Debug();
  }
}

new StandardPage();

'use strict';

import BaseController from './base/base-controller';
import Debug from './debug';

class StandardPage extends BaseController {
  constructor () {
    super();
  }

  onDOMContentLoaded () {
    window.GauntFace.Debug = new Debug();
  }
}

new StandardPage();

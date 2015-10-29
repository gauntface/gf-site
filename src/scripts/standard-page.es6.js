'use strict';

import BaseController from './base/base-controller';
import Debug from './debug';
import PushController from './controllers/push-controller';

export default class StandardPage extends BaseController {
  constructor() {
    super();
  }

  onDOMContentLoaded() {
    window.GauntFace.Debug = new Debug();

    this.pushController = new PushController();
  }
}

new StandardPage();

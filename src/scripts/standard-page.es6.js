'use strict';

import BaseController from './base/base-controller';
import Debug from './debug';

export default class StandardPage extends BaseController {
  constructor() {
    super();
  }

  onDOMContentLoaded() {
    window.GauntFace.Debug = new Debug();
  }
}

new StandardPage();

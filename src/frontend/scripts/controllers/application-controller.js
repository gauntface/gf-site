'use strict';

import logger from '../helpers/logger';
import {loadAnalytics} from '../helpers/analytics';
import {registerSW} from '../helpers/sw';
import {asyncCSS, asyncFontCSS} from '../helpers/css';
import PushController from './push-controller';
import RouteController from './route-controller';
import AppShellController from './appshell-controller';
import PageController from './page-controller';

export default class ApplicationController {
    constructor() {
      document.addEventListener('DOMContentLoaded', () => {
        this.onReady();
      });
      if (document.readyState !== 'loading') {
        this.onReady();
      }
  }

  onReady() {
    loadAnalytics();
    registerSW();
    asyncCSS();
    asyncFontCSS();

    // this._pushController = new PushController();
    this._routeControler = new RouteController();
    this._appshellController = new AppShellController();
    this._pageController = new PageController();

    window.GauntFace.appshell = this._appshellController;
    window.GauntFace.page = this._pageController;
  }

  get pushController() {
    // return this._pushController;
  }
}

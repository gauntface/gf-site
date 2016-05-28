'use strict';

import logger from '../helpers/logger.js';

const STATE_LOADING = Symbol();
const STATE_SIGN_IN = Symbol();
const STATE_GPLUS_ERROR = Symbol();

class SignIn {
  constructor() {
    if (
      !window.GauntFace ||
      !window.GauntFace.data ||
      !window.GauntFace.data.cID ||
      !window.GauntFace.data.sT
    ) {
      throw new Error();
    }

    this._clientID = window.GauntFace.data.cID;
    this._stateToken = window.GauntFace.data.sT;

    delete window.GauntFace.data.cID;
    delete window.GauntFace.data.sT;

    this._currentState = STATE_LOADING;

    this.addGPlusLib();
  }

  get currentState() {
    return this._currentState;
  }

  set currentState(newState) {
    logger('Changing State');
    if (this._currentState === newState) {
      return;
    }

    const signInButton = document.querySelector('.js-sign-in__btn');
    const loadingSpinner = document.querySelector('.spinner');
    const signInTitle = document.querySelector('.js-sign-in__title');

    switch (newState) {
    case STATE_LOADING:
      signInButton.classList.add('is-hidden');
      loadingSpinner.classList.remove('is-hidden');
      break;
    case STATE_SIGN_IN:
      signInButton.classList.remove('is-hidden');
      loadingSpinner.classList.add('is-hidden');
      break;
    case STATE_GPLUS_ERROR:
      loadingSpinner.classList.add('is-hidden');
      signInTitle.textContent = 'Oops';
      break;
    default:
      throw new Error('Unknown state given');
    }

    this._currentState = newState;
  }

  addGPlusLib() {
    // This must be a global method for G+ Script to loaded Async
    window.onGPlusScriptLoaded = () => this.onGPlusLoaded();

    window.addEventListener('load', () => {
      // isSignedOut suppresses the 'Welcome Back' toast from G+.
      // explicit causes G+ not to render a button unless you explicitly
      // call an API to do so.
      window.___gcfg = {isSignedOut: true, parsetags: 'explicit'};

      var scriptTag = document.createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.addEventListener('error', () => {
        this.currentState = STATE_GPLUS_ERROR;
      });
      scriptTag.src =
        'https://apis.google.com/js/client:plusone.js?' +
        'onload=onGPlusScriptLoaded';
      var firstScriptElement = document.getElementsByTagName('script')[0];
      firstScriptElement.parentNode.insertBefore(scriptTag, firstScriptElement);
    });
  }

  onGPlusLoaded() {
    delete window.onGPlusScriptLoaded;

    const signInButton = document.querySelector('.js-sign-in__btn');

    window.gapi.signin.render(
      signInButton,
      {
        clientid: this._clientID,
        cookiepolicy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/plus.profile.emails.read',
        callback: authResult => {
          this.onLoginAttempt(authResult);
        }
      }
    );
  }

  onLoginAttempt(authResult) {
    if (authResult['access_token'] && authResult.code) {
      // Successfully authorized
      this.handleValidLogin(authResult);
      return;
    }

    if (authResult.error) {
      logger('Auth error: ', authResult.error);
    } else if (authResult.error !== 'immediate_failed') {
      logger('Unknown error seems to have occured from the ' +
        'sign in attempt.', authResult.error);
    }

    this.currentState = STATE_SIGN_IN;
  }

  handleValidLogin(authResult) {
    if (!window.fetch) {
      logger('[signin.js]: Browser doesn\'t support fetch');
      return;
    }

    fetch('/admin/signin/auth/',
      {
        'method': 'POST',
        'body': JSON.stringify({
          authCode: authResult.code,
          stateToken: this._stateToken
        }),
        'credentials': 'include',
        'headers': {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Bad response');
        }

        return response.json();
      })
      .then(this.apiResponseCheck)
      .then(response => {
        if (response.error) {
          throw new Error();
        }

        if (!response.data || !response.data.redirect) {
          throw new Error();
        }

        window.location.href = response.data.redirect;
      })
      .catch(err => {
        this.currentState = STATE_SIGN_IN;
      });
  }
}

new SignIn();

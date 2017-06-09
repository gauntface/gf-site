const Prism = require('prismjs');
const path = require('path');

const logHelper = require('./log-helper');

module.exports = (code, lang) => {
  if (!lang) {
    return Promise.resolve({
      html: code,
    });
  }

  const prismLang = Prism.languages[lang];
  if (!prismLang) {
    logHelper.log('Unsupported highlighting language: ', lang);
    return Promise.resolve({
      html: code,
    });
  }

  try {
    const highlightedCode = Prism.highlight(code, prismLang);
    const styles = {
      inline: [
        path.join(__dirname, '../public/styles/html-elements/code-inline.css'),
      ],
      async: [
        '/styles/html-elements/code-async.css',
      ],
    };
    return Promise.resolve({
      html: highlightedCode,
      styles,
    });
  } catch(err) {
    logHelper.warn('Unable to highlight code.', err);
    return Promise.resolve({
      html: code,
    });
  }
};

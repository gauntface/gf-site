const Prism = require('prismjs');
const path = require('path');

const logHelper = require('./log-helper');

module.exports = (code, lang) => {
  const styles = {
    inline: [
      path.join(__dirname, '../public/styles/html-elements/code-inline.css'),
    ],
  };

  if (!lang) {
    const lines = code.split('\n');
    const firstLine = lines.splice(0,1)[0].trim();
    switch (firstLine) {
      case 'javascript': {
        lang = firstLine;
        code = lines.join('\n');
      }
    }
  }

  if (!lang) {
    return Promise.resolve({
      html: code,
      styles,
    });
  }

  const prismLang = Prism.languages[lang];
  if (!prismLang) {
    logHelper.log('Unsupported highlighting language: ', lang);
    return Promise.resolve({
      html: code,
      styles,
    });
  }

  try {
    const highlightedCode = Prism.highlight(code, prismLang);
    styles.async = [
      '/styles/html-elements/code-async.css',
    ];
    return Promise.resolve({
      html: highlightedCode,
      styles,
    });
  } catch(err) {
    logHelper.warn('Unable to highlight code.', err);
    return Promise.resolve({
      html: code,
      styles,
    });
  }
};

const Prism = require('prismjs');

const logHelper = require('./log-helper');

module.exports = (code, lang) => {
  if (!lang) {
    return Promise.resolve(`<pre><code>${code}</code></pre>`);
  }

  const prismLang = Prism.languages[lang];
  if (!prismLang) {
    logHelper.log('Unsupported highlighting language: ', lang);
    return Promise.resolve(`<pre><code>${code}</code></pre>`);
  }

  try {
    const highlightedCode = Prism.highlight(code, prismLang);
    return Promise.resolve(`<pre><code>${highlightedCode}</code></pre>`);
  } catch(err) {
    logHelper.warn('Unable to highlight code.', err);
    return Promise.resolve(`<pre><code>${code}</code></pre>`);
  }
};

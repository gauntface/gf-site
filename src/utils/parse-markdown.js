const marked = require('marked');
const origRenderer = new marked.Renderer();
const renderer = new marked.Renderer();

const highlightCode = require('./highlight-code');
const srcSetGen = require('./src-set-gen');

renderer.image = function(href, title, text) {
  if (href.indexOf('http') === 0) {
    // External image, no src-set
    return origRenderer.image(href, title, text);
  }

  return srcSetGen(href, text);
};

module.exports = (markdownString) => {
  if (!markdownString) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const response = {
      styles: {
        inline: [],
        async: [],
        sync: [],
      },
    };
    const markedOptions = {
      renderer,
      highlight: function(code, lang, callback) {
        return highlightCode(code, lang)
        .then((highlightedCode) => {
          if (highlightedCode.styles) {
            Object.keys(highlightedCode.styles).forEach((key) => {
              response.styles[key] = response.styles[key].concat(
                highlightedCode.styles[key]
              );
            });
          }
          callback(null, highlightedCode.html);
        })
        .catch((err) => {
          callback(null, code);
        });
      },
    };
    return marked(markdownString, markedOptions, (err, htmlString) => {
      if (err) {
        return reject(err);
      }
      response.html = htmlString;
      resolve(response);
    });
  });
};

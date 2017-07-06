const marked = require('marked');

const highlightCode = require('./highlight-code');

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

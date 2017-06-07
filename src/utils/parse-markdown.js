const marked = require('marked');

const highlightCode = require('./highlight-code');

module.exports = (markdownString) => {
  return new Promise((resolve, reject) => {
    if (!markdownString) {
      return resolve(null);
    }

    marked.setOptions({
      highlight: function(code, lang, callback) {
        return highlightCode(code, lang)
        .then((highlightedCode) => callback(null, highlightedCode))
        .catch((err) => {
          callback(null, code);
        });
      },
    });

    marked(markdownString, (err, parsedMarkdown) => {
      if (err) {
        return reject(err);
      }
      resolve(parsedMarkdown);
    });
  })
  .then((parsedMarkdown) => {
    return {
      html: parsedMarkdown,
    };
  });
};

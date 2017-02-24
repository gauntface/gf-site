const path = require('path');
const pathToRegex = require('path-to-regexp');

module.exports = (urlInput) => {
  const parsedAsPath = path.parse(urlInput);
  let type = null;
  if (parsedAsPath.ext.length > 0) {
    const extension = parsedAsPath.ext;
    parsedAsPath.ext = '';
    parsedAsPath.base = path.basename(parsedAsPath.base, extension);
    urlInput = path.format(parsedAsPath);

    switch(extension) {
      case '.html':
        type = 'html';
        break;
      case '.json':
        type = 'json';
        break;
      default:
        throw new Error('Unexpected route type: ', urlInput);
    }
  }

  const regexKeys = [];
  const regex = pathToRegex('/:controller?/:action?/:args*', regexKeys);
  const result = regex.exec(urlInput);
  if (!result) {
    return null;
  }
  const parsedResult = {};
  regexKeys.forEach((keyInfo, index) => {
    parsedResult[keyInfo.name] = result[1 + index];
  });
  // Convert args string into an array of arguments.
  if (parsedResult.args) {
    parsedResult.args = parsedResult.args.split('/');
  }
  parsedResult.type = type;
  return parsedResult;
};

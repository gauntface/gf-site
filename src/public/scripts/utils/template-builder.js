/* eslint-disable no-console */
/* eslint-env browser */

class TemplateBuilder {
  replaceTagContents(tagName, haystack, replace, prependContents = false) {
    const tagRegex = new RegExp(`<${tagName}>((?:.|\\s)*?)<\/${tagName}>`, 'g');
    const tagSearch = tagRegex.exec(haystack);
    if (!tagSearch) {
      console.warn(`Unable to find '${tagName}' tag to replace.`);
      return haystack;
    }
    const replaceString = `<${tagName}>${replace}` +
      (prependContents ? tagSearch[1] : '') + `</${tagName}>`;
    return haystack.replace(tagSearch[0], replaceString);
  }

  replaceMetaTagValue(tagName, haystack, replace) {
    const tagRegex =
      new RegExp(`<meta.* name="${tagName}".*content="(.*)">`, 'g');
    const tagSearch = tagRegex.exec(haystack);
    if (!tagSearch) {
      console.warn(`Unable to find '${tagName}' meta tag to replace.`);
      return haystack;
    }
    return haystack.replace(tagSearch[0],
          `<meta name="theme-color" content="${replace}">`);
  }

  replaceRemoteStyles(haystack, remoteStyles) {
    const remoteStylesRegexp =
      new RegExp(/(window.GauntFace._asyncStyles.*=.*\[)(.*|\s*)(\])/, 'g');
    const remoteStylesSearch = remoteStylesRegexp.exec(haystack);
    if (!remoteStylesSearch) {
      console.warn('Unable to find injection point of asyncStyles.');
      return haystack;
    }
    let replaceString = remoteStylesSearch[1];
    const previousContent = remoteStylesSearch[2].trim();
    if(previousContent) {
      replaceString += previousContent + ',';
    }
    replaceString += `'${remoteStyles.join('\',\'')}'`;
    replaceString += remoteStylesSearch[3];
    return haystack.replace(remoteStylesSearch[0], replaceString);
  }

  mergeTemplates({documentData, shellData, contentData} = {}) {
    if (!documentData || !shellData || !contentData) {
      return Promise.reject(new Error(`You must provide 'documentData', ` +
        `'shellData' & 'contentData' into mergeTemplates().`));
    }

    const dataValues = [documentData, shellData, contentData];
    for (let i = 0; i < dataValues.length; i++) {
      const dataValue = dataValues[i];
      if (!dataValue.html) {
        return Promise.reject(new Error(`'documentData', 'shellData' & ` +
          `'contentData' must have 'html' attributes.`));
      }

      if (!dataValue.styles ||
        !dataValue.styles.inline ||
        !dataValue.styles.remote) {
          return Promise.reject(new Error(`'documentData', 'shellData' & ` +
            `'contentData' must have 'styles' attributes with 'inline' and ` +
            `'remote' attributes.`));
      }
    }

    if (!contentData.metadata || !contentData.metadata.title) {
      return Promise.reject(new Error(`'contentData' must contain a ` +
        `'metadata' parameter with a 'title' parameter.`));
    }
    /** const descriptionRegexp =
      new RegExp(/<meta.*name="description".*content="(.*)">/, 'g');
    **/

    const shellString = this.replaceTagContents(
      'main', shellData.html, contentData.html);
    let documentString = this.replaceTagContents(
      'body', documentData.html, shellString, true);

    const inlineStyles = documentData.styles.inline
      .concat(shellData.styles.inline)
      .concat(contentData.styles.inline);
    const remoteStyles = documentData.styles.remote
      .concat(shellData.styles.remote)
      .concat(contentData.styles.remote);

    if (inlineStyles.length > 0) {
      const inlineStylesString =
        `<style>${inlineStyles.join('</style><style>')}</style>`;
      documentString = this.replaceTagContents(
        'head', documentString, inlineStylesString, true);
    }

    if (remoteStyles.length > 0) {
      documentString = this.replaceRemoteStyles(documentString, remoteStyles);
    }

    let themeColor = '';
    if (contentData.metadata && contentData.metadata.theme_color) {
      themeColor = contentData.metadata.theme_color;
    } else if (documentData.metadata && documentData.metadata.theme_color) {
      themeColor = documentData.metadata.theme_color;
    }
    documentString = this.replaceMetaTagValue(
      'theme-color', documentString, themeColor);

    documentString = this.replaceTagContents(
      'title', documentString, contentData.metadata.title);

    return Promise.resolve(documentString);
  }
}

self.GauntFace = self.GauntFace || {};
self.GauntFace.TemplateBuilder = self.GauntFace.TemplateBuilder ||
  new TemplateBuilder();

const path = require('path');
const fs = require('fs-promise');
const mustache = require('mustache');
const yamlFront = require('yaml-front-matter');

const HopinError = require('../models/HopinError');

class TemplateManager {
  constructor({templatePath}) {
    if (!templatePath) {
      throw new HopinError('no-template-path');
    }
    this._templatePath = templatePath;
    this._templates = {};
  }

  readTemplate(templatePath) {
    return fs.readFile(path.join(this._templatePath, templatePath))
    .then((fileContentBuffer) => fileContentBuffer.toString())
    .then((fileContent) => {
      const yamlDetails = yamlFront.loadFront(fileContent);
      return {
        path: templatePath,
        content: yamlDetails.__content,
        styles: yamlDetails.styles ? yamlDetails.styles : [],
        scripts: yamlDetails.scripts ? yamlDetails.scripts : [],
        partials: yamlDetails.partials ? yamlDetails.partials : [],
      };
    });
  }

  renderHTML(data) {
    if (!data || !data.shell) {
      throw new HopinError('shell-required');
    }
    // TODO: If the template path starts with document
    // render content immediately, get the aggregated
    // styles and scripts, then pass in the document
    // data as styles: {inline, remote} and script: [],
    // with content as a string.
    return this.render(
      data.shell,
      data
    )
    .then((shellDetails) => {
      const documentTemplatePath = 'documents/html.tmpl';
      return this.readTemplate(documentTemplatePath)
      .then((templateDetails) => {
        if (!templateDetails) {
          throw new HopinError('template-not-found', {documentTemplatePath});
        }

        // TODO: Need to add styles and scripts here.
        return mustache.render(
          templateDetails.content, {data, content: shellDetails.content});
      });
    });
  }

  render(templatePath, data) {
    return this._renderSubViews(data)
    .then((subviews) => {
      return this.readTemplate(templatePath)
      .then((templateDetails) => {
        return {subviews, templateDetails};
      });
    })
    .then(({subviews, templateDetails}) => {
      if (!templateDetails) {
        throw new HopinError('template-not-found', {templatePath});
      }

      return this._getPartialDetails(templateDetails)
      .then((partialDetails) => {
        return {subviews, templateDetails, partialDetails};
      });
    })
    .then(({subviews, templateDetails, partialDetails}) => {
      let collectedStyles = templateDetails.styles
        .concat(partialDetails.styles);
      let collectedScripts = templateDetails.scripts
        .concat(partialDetails.scripts);

      const renderData = {
        data,
      };

      // This is called by Mustache whenever {{{content}}} is found in a
      // template.
      renderData.content = () => {
        let initialObject = {
          content: '',
          styles: [],
          scripts: [],
        };
        const mergedDetails = subviews.reduce((details, subview) => {
          details.content += subview.content;
          details.styles = details.styles.concat(subview.styles);
          details.scripts = details.scripts.concat(subview.scripts);
          return details;
        }, initialObject);

        collectedStyles = collectedStyles.concat(mergedDetails.styles);
        collectedScripts = collectedScripts.concat(mergedDetails.scripts);

        return mergedDetails.content;
      };

      for (let i = 0; i < subviews.length; i++) {
        renderData[`content-${i}`] = () => {
          collectedStyles = collectedStyles.concat(subviews[i].styles);
          collectedScripts = collectedScripts.concat(subviews[i].scripts);

          return subviews[i].content;
        };
      }

      const renderedContent = mustache.render(
        templateDetails.content, renderData, partialDetails.partialContents);

      // Sets here are used to remove duplicates.
      return {
        content: renderedContent,
        styles: [...new Set(collectedStyles)],
        scripts: [...new Set(collectedScripts)],
      };
    });
  }

  _renderSubViews(data) {
    if (!data || !data.views || data.views.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.all(
      data.views.map((viewInfo) => {
        return this.render(viewInfo.templatePath, viewInfo.data);
      })
    );
  }

  _getPartialDetails(templateDetails) {
    return Promise.all(
      templateDetails.partials.map((partialPath) => {
        return this.render(partialPath)
        .then((partialDetails) => {
          partialDetails.path = partialPath;
          return partialDetails;
        });
      })
    )
    .then((allPartialDetails) => {
      const partialsInfo = {
        styles: [],
        scripts: [],
        partialContents: {},
      };

      allPartialDetails.forEach((partialDetails) => {
        partialsInfo.styles = partialsInfo.styles
          .concat(partialDetails.styles);
        partialsInfo.scripts = partialsInfo.scripts
          .concat(partialDetails.scripts);

        partialsInfo.partialContents[partialDetails.path] =
          partialDetails.content;
      });

      return partialsInfo;
    });
  }
}

module.exports = TemplateManager;

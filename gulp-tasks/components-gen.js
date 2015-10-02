'use strict';

var path = require('path');
var glob = require('glob');
var fs = require('fs');
var source = require('vinyl-source-stream');

function stringToStream(filename, directoryOfFile, string) {
  var stream = source(filename);
  stream.write(string);
  process.nextTick(function() {
    stream.end();
  });

  return stream;
}

function getComponentObject(componentFile) {
  try {
    var componentFileContents = fs.readFileSync(componentFile);
    return JSON.parse(componentFileContents.toString());
  } catch (exception) {
    console.log('Issue when parsing ' + componentFile, exception);
  }

  return null;
}

function handleComponentFile(componentFile) {
  var directoryOfFile = path.dirname(componentFile);
  var componentObject = getComponentObject(componentFile);
  if (!componentObject) {
    return;
  }

  var importPrefix = '@import \'';
  var importSuffix = '\';\n';

  var pathPrefix = 'src/styles/';

  var possibleInlineFiles = [];
  var possibleRemoteFiles = [];

  // Add Components
  componentObject.components.forEach(function(componentName) {
    possibleInlineFiles.push(
      pathPrefix + 'components/' + componentName + '/' +
        componentName + '-mixins.scss'
    );
    possibleInlineFiles.push(
      pathPrefix + 'components/' + componentName + '/' +
        componentName + '-inline.scss'
    );

    possibleRemoteFiles.push(
      pathPrefix + 'components/' + componentName + '/' +
        componentName + '-mixins.scss'
    );
    possibleRemoteFiles.push(
      pathPrefix + 'components/' + componentName + '/' +
        componentName + '-remote.scss'
    );
  });

  // Add Layouts
  componentObject.layouts.forEach(function(componentName) {
    possibleInlineFiles.push(
      pathPrefix + 'layouts/' + componentName + '/' +
        componentName + '-mixins.scss'
    );
    possibleInlineFiles.push(
      pathPrefix + 'layouts/' + componentName + '/' +
        componentName + '-inline.scss'
    );

    possibleRemoteFiles.push(
      pathPrefix + 'layouts/' + componentName + '/' +
        componentName + '-mixins.scss'
    );
    possibleRemoteFiles.push(
      pathPrefix + 'layouts/' + componentName + '/' +
        componentName + '-remote.scss'
    );
  });

  // Add Inline Extras
  componentObject.extrasInline.forEach(function(extraInlineFilepath) {
    if (!fs.existsSync(extraInlineFilepath)) {
      throw new Error('Required extra not found from [' + componentFile +
        ']: ' + extraInlineFilepath);
    }
    possibleInlineFiles.push(
      extraInlineFilepath
    );
  });

  // Add Remote Extras
  componentObject.extrasRemote.forEach(function(extraRemoteFilepath) {
    possibleRemoteFiles.push(
      extraRemoteFilepath
    );
  });

  var sassInlineString = '';
  var sassRemoteString = '';

  for (var i = 0; i < possibleInlineFiles.length; i++) {
    if (fs.existsSync(possibleInlineFiles[i])) {
      sassInlineString += importPrefix + possibleInlineFiles[i] + importSuffix;
    }
  }

  for (i = 0; i < possibleRemoteFiles.length; i++) {
    if (fs.existsSync(possibleRemoteFiles[i])) {
      sassRemoteString += importPrefix + possibleRemoteFiles[i] + importSuffix;
    }
  }

  var sassStreams = [];
  if (sassInlineString.length > 0) {
    sassStreams.push({
        stream: stringToStream(componentObject.name + '-inline.scss',
          directoryOfFile, sassInlineString),
        urlsToTest: componentObject.urlsToTest
      }
    );
  }

  if (sassRemoteString.length > 0) {
    sassStreams.push({
        stream: stringToStream(componentObject.name + '-remote.scss',
          directoryOfFile, sassRemoteString),
        urlsToTest: componentObject.urlsToTest
      }
    );
  }
  return sassStreams;
}

function generateComponentSass(componentsDir) {
  var jsonComponentsFiles = glob.sync(componentsDir + '/**/*.json');
  var cumulativeStreams = [];
  jsonComponentsFiles.forEach(function(componentFile) {
    var streams = handleComponentFile(componentFile);
    cumulativeStreams = cumulativeStreams.concat(streams);
  });
  return cumulativeStreams;
}

module.exports = {
  generateComponentSass: function() {
    return generateComponentSass(GLOBAL.config.src.components);
  }
};

/**
 * @file This script is used to inline assertions into the README.md documents.
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import _ from 'lodash';

const formatCodeSnippet = (setup) => {
  const paragraphs = [];

  paragraphs.push(setup.code);

  if (setup.options) {
    paragraphs.push('// Options: ' + JSON.stringify(setup.options));
  }

  if (setup.errors) {
    for (const message of setup.errors) {
      paragraphs.push('// Message: ' + message.message);
    }
  }

  if (setup.rules) {
    paragraphs.push('// Additional rules: ' + JSON.stringify(setup.rules));
  }

  if (setup.output) {
    paragraphs.push('// Fixed code: \n// ' + setup.output.split('\n').join('\n// '));
  }

  return paragraphs.join('\n');
};

const getAssertions = () => {
  const assertionFiles = glob.sync(path.resolve(__dirname, '../test/rules/assertions/*.js'));

  const assertionNames = _.map(assertionFiles, (filePath) => {
    return path.basename(filePath, '.js');
  });

  const assertionCodes = _.map(assertionFiles, (filePath) => {
    // eslint-disable-next-line import/no-dynamic-require
    const codes = require(filePath);

    return {
      invalid: _.map(codes.invalid, formatCodeSnippet),
      valid: _.map(codes.valid, formatCodeSnippet),
    };
  });

  return _.zipObject(assertionNames, assertionCodes);
};

const updateDocuments = (assertions) => {
  const readmeDocumentPath = path.join(__dirname, '../README.md');

  let documentBody = fs.readFileSync(readmeDocumentPath, 'utf8');

  documentBody = documentBody.replace(/<!-- assertions ([a-z]+?) -->/giu, (assertionsBlock) => {
    let exampleBody;

    const ruleName = assertionsBlock.match(/assertions ([a-z]+)/iu)[1];

    const ruleAssertions = assertions[ruleName];

    if (!ruleAssertions) {
      throw new Error('No assertions available for rule "' + ruleName + '".');
    }

    exampleBody = '';

    if (ruleAssertions.invalid.length) {
      exampleBody += 'The following patterns are considered problems:\n\n```js\n' + ruleAssertions.invalid.join('\n\n') + '\n```\n\n';
    }

    if (ruleAssertions.valid.length) {
      exampleBody += 'The following patterns are not considered problems:\n\n```js\n' + ruleAssertions.valid.join('\n\n') + '\n```\n\n';
    }

    return exampleBody;
  });

  fs.writeFileSync(readmeDocumentPath, documentBody);
};

updateDocuments(getAssertions());

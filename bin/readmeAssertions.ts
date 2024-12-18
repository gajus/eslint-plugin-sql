/**
 * @file This script is used to inline assertions into the README.md documents.
 */

import { glob } from 'glob';
import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';

type EslintError = {
  message: string;
};

type Setup = {
  code: string;
  errors: EslintError[];
  options: unknown[];
  output: string;
};

const formatCodeSnippet = (setup: Setup) => {
  const paragraphs: string[] = [];

  paragraphs.push(setup.code);

  if (setup.options) {
    paragraphs.push('// Options: ' + JSON.stringify(setup.options));
  }

  if (setup.errors) {
    for (const message of setup.errors) {
      paragraphs.push('// Message: ' + message.message);
    }
  }

  if (setup.output) {
    paragraphs.push(
      '// Fixed code: \n// ' + setup.output.split('\n').join('\n// '),
    );
  }

  return paragraphs.join('\n');
};

const getAssertions = () => {
  const assertionFiles = glob.sync(
    path.resolve(__dirname, '../test/rules/assertions/*.ts'),
  );

  const assertionNames = _.map(assertionFiles, (filePath) => {
    return path.basename(filePath, '.ts');
  });

  const assertionCodes = _.map(assertionFiles, (filePath) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
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

  documentBody = documentBody.replaceAll(
    // eslint-disable-next-line regexp/no-unused-capturing-group
    /<!-- assertions ([a-z]+) -->/giu,
    (assertionsBlock) => {
      let exampleBody = '';

      const ruleName = /assertions ([a-z]+)/iu.exec(assertionsBlock)?.[1];

      if (!ruleName) {
        throw new Error('Rule name not found.');
      }

      const ruleAssertions = assertions[ruleName];

      if (!ruleAssertions) {
        throw new Error('No assertions available for rule "' + ruleName + '".');
      }

      if (ruleAssertions.invalid.length) {
        exampleBody +=
          'The following patterns are considered problems:\n\n```js\n' +
          ruleAssertions.invalid.join('\n\n') +
          '\n```\n\n';
      }

      if (ruleAssertions.valid.length) {
        exampleBody +=
          'The following patterns are not considered problems:\n\n```js\n' +
          ruleAssertions.valid.join('\n\n') +
          '\n```\n\n';
      }

      return exampleBody;
    },
  );

  fs.writeFileSync(readmeDocumentPath, documentBody);
};

updateDocuments(getAssertions());

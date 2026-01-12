/**
 * @file This script is used to inline assertions into the README.md documents.
 */

import { glob } from 'glob';
import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type EslintError = {
  message?: string;
  messageId?: string;
};

type Setup = {
  code: string;
  errors: EslintError[];
  options: unknown[];
  output: string;
};

const formatCodeSnippet = (setup: Setup, ruleMessages: Record<string, string>) => {
  const paragraphs: string[] = [];

  paragraphs.push(setup.code);

  if (setup.options) {
    paragraphs.push('// Options: ' + JSON.stringify(setup.options));
  }

  if (setup.errors) {
    for (const error of setup.errors) {
      const message = error.message || (error.messageId ? ruleMessages[error.messageId] : null) || error.messageId;
      paragraphs.push('// Message: ' + message);
    }
  }

  if (setup.output) {
    paragraphs.push(
      '// Fixed code: \n// ' + setup.output.split('\n').join('\n// '),
    );
  }

  return paragraphs.join('\n');
};

const getAssertions = async () => {
  const ruleFiles = await glob(
    path.resolve(__dirname, '../../src/rules/!(*.test).ts'),
  );

  const assertions: Record<string, any> = {};

  for (const ruleFile of ruleFiles) {
    const ruleName = path.basename(ruleFile, '.ts');
    const testFile = ruleFile.replace('.ts', '.test.ts');

    if (fs.existsSync(testFile)) {
      const { rule } = await import(ruleFile);
      const testModule = await import(testFile);
      const ruleMessages = rule.meta.messages;
      const testCases = testModule.default.testCases;

      assertions[ruleName] = {
        invalid: _.map(testCases.invalid, (setup) => formatCodeSnippet(setup, ruleMessages)),
        valid: _.map(testCases.valid, (setup) => formatCodeSnippet(setup, ruleMessages)),
      };
    }
  }

  return assertions;
};

const updateDocuments = (assertions: Record<string, any>) => {
  const readmeDocumentPath = path.join(__dirname, '../../README.md');

  const documentBody = fs.readFileSync(readmeDocumentPath, 'utf8');

  const newDocumentBody = documentBody.replace(
    /<!-- assertions ([a-z-]+) -->(?:[\S\s]*?<!-- end-assertions -->)?/giu,
    (match, ruleName) => {
      const assertionKey = _.camelCase(ruleName);
      const ruleAssertions = assertions[assertionKey];

      if (!ruleAssertions) {
        return match;
      }

      let exampleBody = '';

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

      return `<!-- assertions ${ruleName} -->\n\n${exampleBody.trim()}\n\n<!-- end-assertions -->`;
    },
  );

  fs.writeFileSync(readmeDocumentPath, newDocumentBody);
};

const assertions = await getAssertions();
updateDocuments(assertions);

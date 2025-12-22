/**
 * @file This script is used to inline assertions into the README.md documents.
 */

import { glob } from 'glob';
import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

type EslintError = {
  message: string;
};

type RuleAssertions = {
  invalid: string[];
  valid: string[];
};

type Setup = {
  code: string;
  errors: EslintError[];
  options: unknown[];
  output: string;
};

const formatCodeSnippet = (
  setup: Setup,
  ruleMessages: Record<string, string>,
) => {
  const paragraphs: string[] = [];

  paragraphs.push(setup.code);

  if (setup.options) {
    paragraphs.push('// Options: ' + JSON.stringify(setup.options));
  }

  if (setup.errors) {
    for (const error of setup.errors) {
      const message =
        error.message ||
        (error.messageId ? ruleMessages[error.messageId] : null) ||
        error.messageId;
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
    path.resolve(dirname, '../../src/rules/!(*.test).ts'),
  );

  const ruleAssertionsMap: Record<string, RuleAssertions> = {};

  const assertionCodes = _.map(assertionFiles, (filePath) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const codes = require(filePath);

    return {
      invalid: _.map(codes.default.testCases.invalid, formatCodeSnippet),
      valid: _.map(codes.default.testCases.valid, formatCodeSnippet),
    };
  });

      ruleAssertionsMap[ruleName] = {
        invalid: _.map(testCases.invalid, (setup) =>
          formatCodeSnippet(setup, ruleMessages),
        ),
        valid: _.map(testCases.valid, (setup) =>
          formatCodeSnippet(setup, ruleMessages),
        ),
      };
    }
  }

  return ruleAssertionsMap;
};

const updateDocuments = (assertionsMap: Record<string, RuleAssertions>) => {
  const readmeDocumentPath = path.join(dirname, '../../README.md');

  let documentBody = fs.readFileSync(readmeDocumentPath, 'utf8');

  const newDocumentBody = documentBody.replaceAll(
    /<!-- assertions ([a-z-]+) -->(?:[\s\S]*?<!-- end-assertions -->)?/giu,
    (match, ruleName) => {
      const assertionKey = _.camelCase(ruleName);
      const ruleAssertions = assertionsMap[assertionKey];

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

const generatedAssertions = await getAssertions();
updateDocuments(generatedAssertions);

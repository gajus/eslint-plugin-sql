/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

import {
  RuleTester,
} from 'eslint';
import {
  camelCase,
  map,
} from 'lodash';
import plugin from '../../src';

const ruleTester = new RuleTester();

const reportingRules = [
  'format',
  'no-unsafe-query',
];

const parser = require.resolve('@babel/eslint-parser');

for (const ruleName of reportingRules) {
  const assertions = require('./assertions/' + camelCase(ruleName));

  assertions.invalid = map(assertions.invalid, (assertion) => {
    assertion.parser = parser;

    return assertion;
  });

  assertions.valid = map(assertions.valid, (assertion) => {
    assertion.parser = parser;

    return assertion;
  });

  ruleTester.run(ruleName, plugin.rules[ruleName], assertions);
}

import plugin from '../../src';
import { RuleTester } from 'eslint';
import { camelCase } from 'lodash';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
  },
});

const reportingRules = ['format', 'no-unsafe-query'];

for (const ruleName of reportingRules) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const assertions = require('./assertions/' + camelCase(ruleName));

  ruleTester.run(ruleName, plugin.rules[ruleName], assertions.default);
}

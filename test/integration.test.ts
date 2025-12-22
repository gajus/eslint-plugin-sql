import { rule as format } from '../src/rules/format.js';
import { RuleTester } from '@typescript-eslint/rule-tester';
import * as mocha from 'mocha';

RuleTester.afterAll = mocha.after;
RuleTester.describe = mocha.describe;
RuleTester.it = mocha.it;
RuleTester.itOnly = mocha.it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2_022,
    sourceType: 'module',
  },
});

describe('format rule with Flat Config', () => {
  ruleTester.run('format', format, {
    invalid: [
      {
        code: 'sql`SELECT 1`',
        errors: [{ messageId: 'format' }],
        options: [{ ignoreInline: false }, {}],
        output: 'sql`\n  SELECT\n    1\n`',
      },
    ],
    valid: [
      {
        code: 'sql`SELECT 1`',
        options: [{ ignoreInline: true }, {}],
      },
    ],
  });
});

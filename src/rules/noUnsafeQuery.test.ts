import { createRuleTester } from '../factories/createRuleTester.js';
import { rule } from './noUnsafeQuery.js';

export default createRuleTester(
  'no-unsafe-query',
  rule,
  {},
  {
    invalid: [
      {
        code: '`SELECT 1`',
        errors: [
          {
            messageId: 'noUnsafeQuery',
          },
        ],
      },
      {
        code: "`SELECT ${'foo'}`",
        errors: [
          {
            messageId: 'noUnsafeQuery',
          },
        ],
      },
      {
        code: "foo`SELECT ${'bar'}`",
        errors: [
          {
            messageId: 'noUnsafeQuery',
          },
        ],
      },
      {
        code: '`SELECT ?`',
        errors: [
          {
            messageId: 'noUnsafeQuery',
          },
        ],
        settings: {
          sql: {
            placeholderRule: '\\?',
          },
        },
      },
      {
        code: "foo`SELECT ${'bar'}`",
        errors: [
          {
            messageId: 'noUnsafeQuery',
          },
        ],
        options: [
          {
            sqlTag: 'SQL',
          },
        ],
      },
    ],
    valid: [
      {
        code: 'sql.unsafe`SELECT 3`',
      },
      {
        code: '`SELECT 1`',
        options: [
          {
            allowLiteral: true,
          },
        ],
      },
      {
        code: 'sql`SELECT 1`',
      },
      {
        code: "sql`SELECT ${'foo'}`",
      },
      {
        code: "SQL`SELECT ${'bar'}`",
        options: [
          {
            sqlTag: 'SQL',
          },
        ],
      },
    ],
  },
);

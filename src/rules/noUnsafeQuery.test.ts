import { createRuleTester } from '../factories/createRuleTester';
import rule from './noUnsafeQuery';

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
            message: 'Use "sql" tag',
          },
        ],
      },
      {
        code: "`SELECT ${'foo'}`",
        errors: [
          {
            message: 'Use "sql" tag',
          },
        ],
      },
      {
        code: "foo`SELECT ${'bar'}`",
        errors: [
          {
            message: 'Use "sql" tag',
          },
        ],
      },
      {
        code: '`SELECT ?`',
        errors: [
          {
            message: 'Use "sql" tag',
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
            message: 'Use "SQL" tag',
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

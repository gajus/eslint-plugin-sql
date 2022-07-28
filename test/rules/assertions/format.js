/* eslint-disable no-template-curly-in-string */

export default {
  invalid: [
    {
      code: `sql\`
IF EXISTS (
    SELECT
        1)
DROP TABLE test;
Select
    1
\``,
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreStartWithNewLine: true,
        },
      ],
      output: `sql\`
IF EXISTS (
    SELECT
        1)
DROP TABLE test;

Select
    1
\``
    },
    {
      code: '`SELECT 1`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
          ignoreTagless: false,
        },
      ],
      output: '`\nSELECT\n    1\n`',
    },
    {
      code: '`SELECT 2`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
          ignoreTagless: false,
        },
        {
          spaces: 2,
        },
      ],
      output: '`\nSELECT\n  2\n`',
    },
    {
      code: 'sql`SELECT 3`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
        },
      ],
      output: 'sql`\nSELECT\n    3\n`',
    },
    {
      code: '`SELECT ${\'foo\'} FROM ${\'bar\'}`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
          ignoreTagless: false,
        },
      ],
      output: '`\nSELECT\n    ${\'foo\'}\nFROM\n    ${\'bar\'}\n`',
    },
  ],
  valid: [
    {
      code: `sql\`
-- valid
IF EXISTS (
    SELECT
        1)
DROP TABLE test;

Select
    1
\``,
      options: [{
        ignoreStartWithNewLine: true,
      }],
    },
    {
      code: 'sql`SELECT 1`',
      options: [
        {
          ignoreInline: true,
        },
      ],
    },
    {
      code: '`SELECT 2`',
      options: [
        {
          ignoreTagless: true,
        },
      ],
    },
    {
      code: '`SELECT ${\'foo\'} FROM ${\'bar\'}`',
      options: [
        {
          ignoreExpressions: true,
          ignoreInline: false,
          ignoreTagless: false,
        },
      ],
    },
  ],
};

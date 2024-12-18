import { createRuleTester } from '../factories/createRuleTester';
import { rule } from './format';
import multiline from 'multiline-ts';

export default createRuleTester(
  'format',
  rule,
  {},
  {
    invalid: [
      {
        code: multiline`
          sql\`
          SELECT
            1
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {},
          {
            spaces: 4,
          },
        ],
        output: multiline`
          sql\`
          SELECT
              1
          \`
        `,
      },
      {
        code: multiline`
          sql.type({ id: z.number() })\`
          SELECT
            1
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {},
          {
            spaces: 4,
          },
        ],
        output: multiline`
          sql.type({ id: z.number() })\`
          SELECT
              1
          \`
        `,
      },
      {
        code: multiline`
          sql.typeAlias('void')\`
          SELECT
            1
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {},
          {
            spaces: 4,
          },
        ],
        output: multiline`
          sql.typeAlias('void')\`
          SELECT
              1
          \`
        `,
      },
      {
        code: '`SELECT 1`',
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {
            ignoreInline: false,
            ignoreTagless: false,
          },
          {},
        ],
        output: '`\nSELECT\n    1\n`',
      },
      {
        code: '`SELECT 2`',
        errors: [
          {
            messageId: 'format',
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
        code: 'sql.unsafe`SELECT 3`',
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {
            ignoreInline: false,
          },
          {},
        ],
        output: 'sql.unsafe`\nSELECT\n    3\n`',
      },
      {
        code: 'sql.type()`SELECT 3`',
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {
            ignoreInline: false,
          },
          {},
        ],
        output: 'sql.type()`\nSELECT\n    3\n`',
      },
      {
        code: "`SELECT ${'foo'} FROM ${'bar'}`",
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {
            ignoreInline: false,
            ignoreTagless: false,
          },
          {},
        ],
        output: "`\nSELECT\n    ${'foo'}\nFROM\n    ${'bar'}\n`",
      },
      {
        code: "    const code = sql`\n    SELECT\n        ${'foo'}\n    FROM\n        ${'bar'}\n`",
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {
            ignoreBaseIndent: false,
          },
          {},
        ],
        output:
          "    const code = sql`\nSELECT\n    ${'foo'}\nFROM\n    ${'bar'}\n`",
      },
      {
        code: 'SQL`SELECT 1`',
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {
            ignoreInline: false,
            sqlTag: 'SQL',
          },
          {},
        ],
        output: 'SQL`\nSELECT\n    1\n`',
      },
    ],
    valid: [
      {
        code: multiline`
          \`
          # A
          ## B
          ### C
          \`
        `,
      },
      {
        code: 'sql`SELECT 1`',
        options: [
          {
            ignoreInline: true,
          },
          {},
        ],
      },
      {
        code: '`SELECT 2`',
        options: [
          {
            ignoreTagless: true,
          },
          {},
        ],
      },
      {
        code: "`SELECT ${'foo'} FROM ${'bar'}`",
        options: [
          {
            ignoreExpressions: true,
            ignoreInline: false,
            ignoreTagless: false,
          },
          {},
        ],
      },
      {
        code: "    const code = sql`\n    SELECT\n        ${'foo'}\n    FROM\n        ${'bar'}\n    `",
        options: [
          {
            ignoreBaseIndent: true,
          },
          {},
        ],
      },
      {
        code: '   const code = sql`\n        DROP TABLE foo\n    `;',
        options: [
          {
            ignoreBaseIndent: true,
          },
          {},
        ],
      },
      {
        code: '   const code = sql`\n        DROP TABLE foo;\n\n        DROP TABLE foo;\n    `;',
        options: [
          {
            ignoreBaseIndent: true,
          },
          {},
        ],
      },
    ],
  },
);

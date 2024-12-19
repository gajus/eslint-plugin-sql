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
          sql.fragment\`
            \${null}
          UPDATE assistant_response
          SET
            messages = \${sql.jsonb(pickedMessages as unknown as SerializableValue[])}
          WHERE id = \${assistantResponse.id}
          \`;
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {},
          {
            tabWidth: 4,
          },
        ],
        output: multiline`
          sql.fragment\`
            \${null}
            UPDATE assistant_response
            SET
                messages = \${sql.jsonb(pickedMessages as unknown as SerializableValue[])}
            WHERE
                id = \${assistantResponse.id}
          \`;
        `,
      },
      {
        code: multiline`
          await pool.query(sql.typeAlias('void')\`
            UPDATE assistant_response
            SET
              messages = \${sql.jsonb(pickedMessages as unknown as SerializableValue[])}
            WHERE id = \${assistantResponse.id}
          \`);
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [
          {},
          {
            tabWidth: 4,
          },
        ],
        output: multiline`
          await pool.query(sql.typeAlias('void')\`
            UPDATE assistant_response
            SET
                messages = \${sql.jsonb(pickedMessages as unknown as SerializableValue[])}
            WHERE
                id = \${assistantResponse.id}
          \`);
        `,
      },
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
            tabWidth: 4,
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
            tabWidth: 4,
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
            tabWidth: 4,
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
        output: multiline`
          \`
            SELECT
              1
          \`
        `,
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
            tabWidth: 2,
          },
        ],
        output: multiline`
          \`
            SELECT
              2
          \`
        `,
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
        output: multiline`
          sql.unsafe\`
            SELECT
              3
          \`
        `,
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
        output: multiline`
          sql.type()\`
            SELECT
              3
          \`
        `,
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
        output: multiline`
          \`
            SELECT
              \${'foo'}
            FROM
              \${'bar'}
          \`
        `,
      },
      {
        code: multiline`
          const code = sql\`
            SELECT
                ${'foo'}
            FROM
                ${'bar'}
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        options: [{}, {}],
        output: multiline`
          const code = sql\`
            SELECT
              ${'foo'}
            FROM
              ${'bar'}
          \`
        `,
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
        output: multiline`
          SQL\`
            SELECT
              1
          \`
        `,
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
        code: multiline`
          const code = sql\`
            SELECT
              \${'foo'}
            FROM
              \${'bar'}
          \`
        `,
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
        code: multiline`
          const code = sql\`
            SELECT
              \${'foo'}
            FROM
              \${'bar'}
          \`
        `,
        options: [{}, {}],
      },
      {
        code: multiline`
          const code = sql\`
            DROP TABLE foo
          \`
        `,
        options: [{}, {}],
      },
      {
        code: multiline`
          const code = sql\`
            DROP TABLE foo;

            DROP TABLE foo;
          \`
        `,

        options: [{}, {}],
      },
    ],
  },
);

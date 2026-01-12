import { createRuleTester } from '../factories/createRuleTester.js';
import { rule } from './format.js';
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
            SELECT
              m1.ID
            FROM
              message m1
            WHERE
              m1.ID = \${message.id}
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        name: 'identifierCase:lower',
        options: [
          {},
          {
            identifierCase: 'lower',
          },
        ],
        output: multiline`
          sql.fragment\`
            SELECT
              m1.id
            FROM
              message m1
            WHERE
              m1.id = \${message.id}
          \`
        `,
      },
      {
        code: multiline`
          sql.fragment\`
            SELECT id::NUMERIC
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        name: 'dataTypeCase:lower',
        options: [
          {},
          {
            dataTypeCase: 'lower',
            language: 'postgresql',
          },
        ],
        output: multiline`
          sql.fragment\`
            SELECT
              id::numeric
          \`
        `,
      },
      {
        code: multiline`
          sql.fragment\`
            SELECT
              COUNT(*)
            FROM
              message
            WHERE
              id = \${message.id}
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        name: 'keywordCase:lower',
        options: [
          {},
          {
            keywordCase: 'lower',
          },
        ],
        output: multiline`
          sql.fragment\`
            select
              COUNT(*)
            from
              message
            where
              id = \${message.id}
          \`
        `,
      },
      {
        code: multiline`
          sql.fragment\`
            select
              COUNT(*)
            from
              message
            where
              id = \${message.id}
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        name: 'keywordCase:upper',
        options: [
          {},
          {
            keywordCase: 'upper',
          },
        ],
        output: multiline`
          sql.fragment\`
            SELECT
              COUNT(*)
            FROM
              message
            WHERE
              id = \${message.id}
          \`
        `,
      },
      {
        code: multiline`
          sql.fragment\`
            \${null}
          UPDATE message
          SET
            messages = \${sql.jsonb(messages as unknown as SerializableValue[])}
          WHERE id = \${message.id}
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
            UPDATE message
            SET
                messages = \${sql.jsonb(messages as unknown as SerializableValue[])}
            WHERE
                id = \${message.id}
          \`;
        `,
      },
      {
        code: multiline`
          await pool.query(sql.typeAlias('void')\`
            UPDATE message
            SET
              messages = \${sql.jsonb(messages as unknown as SerializableValue[])}
            WHERE id = \${message.id}
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
            UPDATE message
            SET
                messages = \${sql.jsonb(messages as unknown as SerializableValue[])}
            WHERE
                id = \${message.id}
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
      {
        code: multiline`
          sql\`
            SELECT hi !
          \`
        `,
        errors: [
          {
            messageId: 'parseError',
          },
        ],
        name: 'reports parse error for malformed SQL instead of crashing',
        options: [{}, {}],
      },
      {
        code: multiline`
          sql\`
            SELECT * FROM users WHERE name = :name AND id = :id
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        name: 'formats MySQL query with custom named placeholders using paramTypes',
        options: [
          {},
          {
            language: 'mysql',
            paramTypes: { named: [':'] },
          },
        ],
        output: multiline`
          sql\`
            SELECT
              *
            FROM
              users
            WHERE
              name = :name
              AND id = :id
          \`
        `,
      },
      {
        code: multiline`
          SQL\`
            SELECT * FROM users WHERE user_id = :user_id
          \`
        `,
        errors: [
          {
            messageId: 'format',
          },
        ],
        name: 'formats PostgreSQL query with named placeholder using paramTypes',
        options: [
          {
            sqlTag: 'SQL',
          },
          {
            keywordCase: 'upper',
            language: 'postgresql',
            paramTypes: { named: [':'] },
          },
        ],
        output: multiline`
          SQL\`
            SELECT
              *
            FROM
              users
            WHERE
              user_id = :user_id
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

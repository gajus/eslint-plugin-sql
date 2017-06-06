/* eslint-disable no-template-curly-in-string */

export default {
  invalid: [
    {
      code: '`SELECT 1`',
      errors: [
        {
          message: 'Format the query'
        }
      ],
      options: [
        {
          ignoreInline: false,
          ignoreTagless: false
        }
      ],
      output: '`SELECT\n    1\n`'
    },
    {
      code: '`SELECT 2`',
      errors: [
        {
          message: 'Format the query'
        }
      ],
      options: [
        {
          ignoreInline: false,
          ignoreTagless: false
        },
        {
          spaces: 2
        }
      ],
      output: '`SELECT\n  2\n`'
    },
    {
      code: 'sql`SELECT 3`',
      errors: [
        {
          message: 'Format the query'
        }
      ],
      options: [
        {
          ignoreInline: false
        }
      ],
      output: 'sql`SELECT\n    3\n`'
    },
    {
      code: '`SELECT ${\'foo\'} FROM ${\'bar\'}`',
      errors: [
        {
          message: 'Format the query'
        }
      ],
      options: [
        {
          ignoreInline: false,
          ignoreTagless: false
        }
      ],
      output: '`SELECT\n    ${\'foo\'}\nFROM\n    ${\'bar\'}\n`'
    }
  ],
  valid: [
    {
      code: 'sql`SELECT 1`',
      options: [
        {
          ignoreInline: true
        }
      ]
    },
    {
      code: '`SELECT 2`',
      options: [
        {
          ignoreTagless: true
        }
      ]
    },
    {
      code: '`SELECT ${\'foo\'} FROM ${\'bar\'}`',
      options: [
        {
          ignoreExpressions: true,
          ignoreInline: false,
          ignoreTagless: false
        }
      ]
    }
  ]
};

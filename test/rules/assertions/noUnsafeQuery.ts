export default {
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
  ],
  valid: [
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
      code: 'sql``',
    },
  ],
};

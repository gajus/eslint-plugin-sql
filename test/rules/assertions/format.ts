export default {
  invalid: [
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
      output: '`\n    SELECT\n        1\n`',
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
      output: '`\n  SELECT\n    2\n`',
    },
    {
      code: 'sql.unsafe`SELECT 3`',
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
      output: 'sql.unsafe`\n    SELECT\n        3\n`',
    },
    {
      code: 'sql.type()`SELECT 3`',
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
      output: 'sql.type()`\n    SELECT\n        3\n`',
    },
    {
      code: "`SELECT ${'foo'} FROM ${'bar'}`",
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
      output: "`\n    SELECT\n        ${'foo'}\n    FROM\n        ${'bar'}\n`",
    },
    {
      code: "\t\t`SELECT ${'foo'} FROM ${'bar'}`",
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
      output:
        "\t\t`\n\t\t    SELECT\n\t\t        ${'foo'}\n\t\t    FROM\n\t\t        ${'bar'}\n\t\t`",
    },
    {
      code: '\tconst s = sql`SELECT\n1\nFROM\ntable`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {},
        {
          spaces: 2,
        },
      ],
      output:
        '\tconst s = sql`\n\t  SELECT\n\t    1\n\t  FROM\n\t    table\n\t`',
    },
    {
      code: '\tconst s = sql`SELECT 1 FROM table`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
        },
        {
          tabs: true,
        },
      ],
      output:
        '\tconst s = sql`\n\t\tSELECT\n\t\t\t1\n\t\tFROM\n\t\t\ttable\n\t`',
    },
    {
      code: '\tconst s = sql`SELECT 1 FROM table`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
        },
        {
          spaces: 0,
          tabs: false,
        },
      ],
      output:
        '\tconst s = sql`\n\t    SELECT\n\t        1\n\t    FROM\n\t        table\n\t`',
    },
    {
      code: '  const s = sql`SELECT 1 FROM table`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
        },
        {
          spaces: 0,
          tabs: false,
        },
      ],
      output:
        '  const s = sql`\n      SELECT\n          1\n      FROM\n          table\n  `',
    },
    {
      code: '\tsql`SELECT 1 FROM table`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
          matchIndentation: false,
        },
      ],
      output: '\tsql`\nSELECT\n    1\nFROM\n    table`',
    },
    {
      code: '\tconst query = sql`\nDELETE FROM table AS t\nWHERE t.id = ${foo}AND t.type = ${type};`',
      errors: [
        {
          message: 'Format the query',
        },
      ],
      options: [
        {
          ignoreInline: false,
          matchIndentation: true,
        },
      ],
      output:
        '\tconst query = sql`\n\t    DELETE FROM table AS t\n\t    WHERE t.id = ${foo}\n\t        AND t.type = ${type};\n\t`',
    },
  ],
  valid: [
    {
      code: 'sql`SELECT 1`',
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
      code: "`SELECT ${'foo'} FROM ${'bar'}`",
      options: [
        {
          ignoreExpressions: true,
          ignoreInline: false,
          ignoreTagless: false,
        },
      ],
    },
    {
      code: '\tconst s = sql`\n\t  SELECT\n\t    1\n\t  FROM\n\t    table\n\t`',
      options: [
        {},
        {
          spaces: 2,
        },
      ],
    },
    {
      code: '\tconst query = sql`\n\t  DELETE FROM table AS t\n\t  WHERE t.id = ${foo}\n\t    AND t.type = ${type};\n\t`',
      options: [
        {},
        {
          spaces: 2,
        },
      ],
    },
  ],
};

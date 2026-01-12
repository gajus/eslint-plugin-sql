<a name="user-content-eslint-plugin-sql"></a>
<a name="eslint-plugin-sql"></a>
# eslint-plugin-sql

[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

SQL linting rules for ESLint.

> In its current form, the plugin has been designed and tested to work with Postgres codebase.

* [eslint-plugin-sql](#user-content-eslint-plugin-sql)
    * [Installation](#user-content-eslint-plugin-sql-installation)
    * [Configuration](#user-content-eslint-plugin-sql-configuration)
    * [Settings](#user-content-eslint-plugin-sql-settings)
        * [`placeholderRule`](#user-content-eslint-plugin-sql-settings-placeholderrule)
    * [Rules](#user-content-eslint-plugin-sql-rules)
        * [`format`](#user-content-eslint-plugin-sql-rules-format)
        * [`no-unsafe-query`](#user-content-eslint-plugin-sql-rules-no-unsafe-query)


<a name="user-content-eslint-plugin-sql-installation"></a>
<a name="eslint-plugin-sql-installation"></a>
## Installation

1. Install [ESLint](https://www.github.com/eslint/eslint).
1. Install [`eslint-plugin-sql`](https://github.com/gajus/eslint-plugin-sql) plugin.

<!-- -->

```sh
npm install eslint --save-dev
npm install eslint-plugin-sql --save-dev
```

<a name="user-content-eslint-plugin-sql-configuration"></a>
<a name="eslint-plugin-sql-configuration"></a>
## Configuration

1. Add `plugins` section and specify `eslint-plugin-sql` as a plugin.
1. Enable rules.

<!-- -->

```json
{
  "plugins": [
    "sql"
  ],
  "rules": {
    "sql/format": [
      2,
      {
        "ignoreExpressions": false,
        "ignoreInline": true,
        "ignoreTagless": true
      }
    ],
    "sql/no-unsafe-query": [
      2,
      {
        "allowLiteral": false
      }
    ]
  },
  "settings": {
    "sql": {
      "placeholderRule": "\\?"
    }
  }
}

```

<a name="user-content-eslint-plugin-sql-settings"></a>
<a name="eslint-plugin-sql-settings"></a>
## Settings

<a name="user-content-eslint-plugin-sql-settings-placeholderrule"></a>
<a name="eslint-plugin-sql-settings-placeholderrule"></a>
### <code>placeholderRule</code>

A regex used to ignore placeholders or other fragments of the query that'd make it invalid SQL query, e.g.

If you are using `?` placeholders in your queries, you must ignore `\?` pattern as otherwise the string is not going to be recognized as a valid SQL query.

This configuration is relevant for `sql/no-unsafe-query` to match queries containing placeholders as well as for `sql/format` when used with `{ignoreTagless: false}` configuration.

<a name="user-content-eslint-plugin-sql-rules"></a>
<a name="eslint-plugin-sql-rules"></a>
## Rules

<!-- Rules are sorted alphabetically. -->

<a name="user-content-eslint-plugin-sql-rules-format"></a>
<a name="eslint-plugin-sql-rules-format"></a>
### <code>format</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).

This rule is used to format the queries using [sql-formatter](https://github.com/sql-formatter-org/sql-formatter).

<a name="user-content-eslint-plugin-sql-rules-format-options"></a>
<a name="eslint-plugin-sql-rules-format-options"></a>
#### Options

The first option is an object with the following configuration.

|configuration|format|default|description|
|---|---|---|---|
|`ignoreExpressions`|boolean|`false`|Does not format template literals that contain expressions.|
|`ignoreInline`|boolean|`true`|Does not format queries that are written on a single line.|
|`ignoreStartWithNewLine`|boolean|`true`|Does not remove `\n` at the beginning of queries.|
|`ignoreTagless`|boolean|`true`|Does not format queries that are written without using `sql` tag.|
|`retainBaseIndent`|boolean|`true`|Uses the first line of the query as the base indent.|
|`sqlTag`|string|`sql`|Template tag name for SQL.|

The second option is an object with the [`sql-formatter` configuration](https://github.com/sql-formatter-org/sql-formatter?tab=readme-ov-file#configuration-options).

|configuration|default|description|
|---|---|---|
|`useTabs`|`false`|Use tabs for indentation.|
|`tabWidth`|2|Number of spaces per indentation.|
|`language`|`sql`|Language of the query.|
|`keywordCase`|`preserve`|Determines the case of keywords (`preserve`, `upper`, `lower`).|
|`dataTypeCase`|`preserve`|Determines the case of data types (`preserve`, `upper`, `lower`).|
|`denseOperators`|`false`|Decides whitespace around operators.|
|`identifierCase`|`preserve`|Determines the case of identifiers (`preserve`, `upper`, `lower`).|
|`functionCase`|`preserve`|Determines the case of functions (`preserve`, `upper`, `lower`).|

The following patterns are considered problems:

```js
sql.fragment`
  SELECT
    m1.ID
  FROM
    message m1
  WHERE
    m1.ID = ${message.id}
`
// Options: [{},{"identifierCase":"lower"}]
// Message: undefined
// Fixed code: 
// sql.fragment`
//   SELECT
//     m1.id
//   FROM
//     message m1
//   WHERE
//     m1.id = ${message.id}
// `

sql.fragment`
  SELECT id::NUMERIC
`
// Options: [{},{"dataTypeCase":"lower","language":"postgresql"}]
// Message: undefined
// Fixed code: 
// sql.fragment`
//   SELECT
//     id::numeric
// `

sql.fragment`
  SELECT
    COUNT(*)
  FROM
    message
  WHERE
    id = ${message.id}
`
// Options: [{},{"keywordCase":"lower"}]
// Message: undefined
// Fixed code: 
// sql.fragment`
//   select
//     COUNT(*)
//   from
//     message
//   where
//     id = ${message.id}
// `

sql.fragment`
  select
    COUNT(*)
  from
    message
  where
    id = ${message.id}
`
// Options: [{},{"keywordCase":"upper"}]
// Message: undefined
// Fixed code: 
// sql.fragment`
//   SELECT
//     COUNT(*)
//   FROM
//     message
//   WHERE
//     id = ${message.id}
// `

sql.fragment`
  ${null}
UPDATE message
SET
  messages = ${sql.jsonb(messages as unknown as SerializableValue[])}
WHERE id = ${message.id}
`;
// Options: [{},{"tabWidth":4}]
// Message: undefined
// Fixed code: 
// sql.fragment`
//   ${null}
//   UPDATE message
//   SET
//       messages = ${sql.jsonb(messages as unknown as SerializableValue[])}
//   WHERE
//       id = ${message.id}
// `;

await pool.query(sql.typeAlias('void')`
  UPDATE message
  SET
    messages = ${sql.jsonb(messages as unknown as SerializableValue[])}
  WHERE id = ${message.id}
`);
// Options: [{},{"tabWidth":4}]
// Message: undefined
// Fixed code: 
// await pool.query(sql.typeAlias('void')`
//   UPDATE message
//   SET
//       messages = ${sql.jsonb(messages as unknown as SerializableValue[])}
//   WHERE
//       id = ${message.id}
// `);

sql`
  SELECT
    1
`
// Options: [{},{"tabWidth":4}]
// Message: undefined
// Fixed code: 
// sql`
//   SELECT
//       1
// `

sql.type({ id: z.number() })`
  SELECT
    1
`
// Options: [{},{"tabWidth":4}]
// Message: undefined
// Fixed code: 
// sql.type({ id: z.number() })`
//   SELECT
//       1
// `

sql.typeAlias('void')`
  SELECT
    1
`
// Options: [{},{"tabWidth":4}]
// Message: undefined
// Fixed code: 
// sql.typeAlias('void')`
//   SELECT
//       1
// `

`SELECT 1`
// Options: [{"ignoreInline":false,"ignoreTagless":false},{}]
// Message: undefined
// Fixed code: 
// `
//   SELECT
//     1
// `

`SELECT 2`
// Options: [{"ignoreInline":false,"ignoreTagless":false},{"tabWidth":2}]
// Message: undefined
// Fixed code: 
// `
//   SELECT
//     2
// `

sql.unsafe`SELECT 3`
// Options: [{"ignoreInline":false},{}]
// Message: undefined
// Fixed code: 
// sql.unsafe`
//   SELECT
//     3
// `

sql.type()`SELECT 3`
// Options: [{"ignoreInline":false},{}]
// Message: undefined
// Fixed code: 
// sql.type()`
//   SELECT
//     3
// `

`SELECT ${'foo'} FROM ${'bar'}`
// Options: [{"ignoreInline":false,"ignoreTagless":false},{}]
// Message: undefined
// Fixed code: 
// `
//   SELECT
//     ${'foo'}
//   FROM
//     ${'bar'}
// `

const code = sql`
  SELECT
      foo
  FROM
      bar
`
// Options: [{},{}]
// Message: undefined
// Fixed code: 
// const code = sql`
//   SELECT
//     foo
//   FROM
//     bar
// `

SQL`SELECT 1`
// Options: [{"ignoreInline":false,"sqlTag":"SQL"},{}]
// Message: undefined
// Fixed code: 
// SQL`
//   SELECT
//     1
// `
```

The following patterns are not considered problems:

```js
`
# A
## B
### C
`

sql`SELECT 1`
// Options: [{"ignoreInline":true},{}]

`SELECT 2`
// Options: [{"ignoreTagless":true},{}]

const code = sql`
  SELECT
    ${'foo'}
  FROM
    ${'bar'}
`
// Options: [{"ignoreExpressions":true,"ignoreInline":false,"ignoreTagless":false},{}]

const code = sql`
  SELECT
    ${'foo'}
  FROM
    ${'bar'}
`
// Options: [{},{}]

const code = sql`
  DROP TABLE foo
`
// Options: [{},{}]

const code = sql`
  DROP TABLE foo;

  DROP TABLE foo;
`
// Options: [{},{}]
```



<a name="user-content-eslint-plugin-sql-rules-no-unsafe-query"></a>
<a name="eslint-plugin-sql-rules-no-unsafe-query"></a>
### <code>no-unsafe-query</code>

Disallows use of SQL inside of template literals without the `sql` tag.

The `sql` tag can be anything, e.g.

* https://github.com/seegno/sql-tag
* https://github.com/gajus/mightyql#tagged-template-literals

<a name="user-content-eslint-plugin-sql-rules-no-unsafe-query-options-1"></a>
<a name="eslint-plugin-sql-rules-no-unsafe-query-options-1"></a>
#### Options

The first option is an object with the following configuration.

|configuration|format|default|description|
|---|---|---|---|
|`allowLiteral`|boolean|`false`|Controls whether `sql` tag is required for template literals containing literal queries, i.e. template literals without expressions.|
|`sqlTag`|string|`sql`|Template tag name for SQL.|

The following patterns are considered problems:

```js
`SELECT 1`
// Message: undefined

`SELECT ${'foo'}`
// Message: undefined

foo`SELECT ${'bar'}`
// Message: undefined

`SELECT ?`
// Message: undefined

foo`SELECT ${'bar'}`
// Options: [{"sqlTag":"SQL"}]
// Message: undefined
```

The following patterns are not considered problems:

```js
sql.unsafe`SELECT 3`

`SELECT 1`
// Options: [{"allowLiteral":true}]

sql`SELECT 1`

sql`SELECT ${'foo'}`

SQL`SELECT ${'bar'}`
// Options: [{"sqlTag":"SQL"}]
```




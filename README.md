<a name="eslint-plugin-sql"></a>
# eslint-plugin-sql

[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-sql/master.svg?style=flat-square)](https://travis-ci.com/github/gajus/eslint-plugin-sql)
[![NPM version](http://img.shields.io/npm/v/eslint-plugin-sql.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-sql)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

SQL linting rules for ESLint.

> In its current form, the plugin has been designed and tested to work with Postgres codebase.

* [eslint-plugin-sql](#eslint-plugin-sql)
    * [Installation](#eslint-plugin-sql-installation)
    * [Configuration](#eslint-plugin-sql-configuration)
    * [Settings](#eslint-plugin-sql-settings)
        * [`placeholderRule`](#eslint-plugin-sql-settings-placeholderrule)
    * [Rules](#eslint-plugin-sql-rules)
        * [`format`](#eslint-plugin-sql-rules-format)
        * [`no-unsafe-query`](#eslint-plugin-sql-rules-no-unsafe-query)


<a name="eslint-plugin-sql-installation"></a>
## Installation

1. Install [ESLint](https://www.github.com/eslint/eslint).
1. Install [`eslint-plugin-sql`](https://github.com/gajus/eslint-plugin-sql) plugin.

<!-- -->

```sh
npm install eslint --save-dev
npm install eslint-plugin-sql --save-dev
```

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
  }
}

```

<a name="eslint-plugin-sql-settings"></a>
## Settings

<a name="eslint-plugin-sql-settings-placeholderrule"></a>
### <code>placeholderRule</code>

A regex used to ignore placeholders or other fragments of the query that'd make it invalid SQL query, e.g.

If you are using `?` placeholders in your queries, you must ignore `\?` pattern as otherwise the string is not going to be recognized as a valid SQL query.

This configuration is relevant for `sql/no-unsafe-query` to match queries containing placeholders as well as for `sql/format` when used with `{ignoreTagless: false}` configuration.

<a name="eslint-plugin-sql-rules"></a>
## Rules

<!-- Rules are sorted alphabetically. -->

<a name="eslint-plugin-sql-rules-format"></a>
### <code>format</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).

This rule is used to format the queries using [pg-formatter](https://github.com/gajus/pg-formatter).

<a name="eslint-plugin-sql-rules-format-options"></a>
#### Options

The first option is an object with the following configuration.

|configuration|format|default|description|
|---|---|---|---|
|`ignoreExpressions`|boolean|`false`|Does not format template literals that contain expressions.|
|`ignoreInline`|boolean|`true`|Does not format queries that are written on a single line.|
|`ignoreTagless`|boolean|`true`|Does not format queries that are written without using `sql` tag.|
|`ignoreStartWithNewLine`|boolean|`true`|Does not remove `\n` at the beginning of queries.|

The second option is an object with the [`pg-formatter` configuration](https://github.com/gajus/pg-formatter#configuration).

The following patterns are considered problems:

```js
`SELECT 1`
// Options: [{"ignoreInline":false,"ignoreTagless":false}]
// Message: Format the query
// Fixed code: 
// `
// SELECT
//     1
// `

`SELECT 2`
// Options: [{"ignoreInline":false,"ignoreTagless":false},{"spaces":2}]
// Message: Format the query
// Fixed code: 
// `
// SELECT
//   2
// `

sql`SELECT 3`
// Options: [{"ignoreInline":false}]
// Message: Format the query
// Fixed code: 
// sql`
// SELECT
//     3
// `

`SELECT ${'foo'} FROM ${'bar'}`
// Options: [{"ignoreInline":false,"ignoreTagless":false}]
// Message: Format the query
// Fixed code: 
// `
// SELECT
//     ${'foo'}
// FROM
//     ${'bar'}
// `
```

The following patterns are not considered problems:

```js
sql`SELECT 1`
// Options: [{"ignoreInline":true}]

`SELECT 2`
// Options: [{"ignoreTagless":true}]

`SELECT ${'foo'} FROM ${'bar'}`
// Options: [{"ignoreExpressions":true,"ignoreInline":false,"ignoreTagless":false}]
```



<a name="eslint-plugin-sql-rules-no-unsafe-query"></a>
### <code>no-unsafe-query</code>

Disallows use of SQL inside of template literals without the `sql` tag.

The `sql` tag can be anything, e.g.

* https://github.com/seegno/sql-tag
* https://github.com/gajus/mightyql#tagged-template-literals

<a name="eslint-plugin-sql-rules-no-unsafe-query-options-1"></a>
#### Options

The first option is an object with the following configuration.

|configuration|format|default|description|
|---|---|---|---|
|`allowLiteral`|boolean|`false`|Controls whether `sql` tag is required for template literals containing literal queries, i.e. template literals without expressions.|

The following patterns are considered problems:

```js
`SELECT 1`
// Message: Use "sql" tag

`SELECT ${'foo'}`
// Message: Use "sql" tag

foo`SELECT ${'bar'}`
// Message: Use "sql" tag

`SELECT ?`
// Message: Use "sql" tag
```

The following patterns are not considered problems:

```js
`SELECT 1`
// Options: [{"allowLiteral":true}]

sql`SELECT 1`

sql`SELECT ${'foo'}`
```




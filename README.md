<a name="user-content-eslint-plugin-sql"></a>
<a name="eslint-plugin-sql"></a>
# eslint-plugin-sql

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-sql.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-sql)
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

This rule is used to format the queries using [pg-formatter](https://github.com/gajus/pg-formatter).

<a name="user-content-eslint-plugin-sql-rules-format-options"></a>
<a name="eslint-plugin-sql-rules-format-options"></a>
#### Options

The first option is an object with the following configuration.

|configuration|format|default|description|
|---|---|---|---|
|`ignoreBaseIndent`|boolean|`false`|Does not leave base indent before linting.|
|`ignoreExpressions`|boolean|`false`|Does not format template literals that contain expressions.|
|`ignoreInline`|boolean|`true`|Does not format queries that are written on a single line.|
|`ignoreStartWithNewLine`|boolean|`true`|Does not remove `\n` at the beginning of queries.|
|`ignoreTagless`|boolean|`true`|Does not format queries that are written without using `sql` tag.|
|`sqlTag`|string|`sql`|Template tag name for SQL.|

The second option is an object with the [`pg-formatter` configuration](https://github.com/gajus/pg-formatter#configuration).



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




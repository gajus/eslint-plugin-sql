# eslint-plugin-sql

[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

SQL linting rules for ESLint.

> In its current form, the plugin has been designed and tested to work with Postgres codebase.

{"gitdown": "contents"}

## Installation

1. Install [ESLint](https://www.github.com/eslint/eslint).
1. Install [`eslint-plugin-sql`](https://github.com/gajus/eslint-plugin-sql) plugin.

<!-- -->

```sh
npm install eslint --save-dev
npm install eslint-plugin-sql --save-dev
```

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

## Settings

### `placeholderRule`

A regex used to ignore placeholders or other fragments of the query that'd make it invalid SQL query, e.g.

If you are using `?` placeholders in your queries, you must ignore `\?` pattern as otherwise the string is not going to be recognized as a valid SQL query.

This configuration is relevant for `sql/no-unsafe-query` to match queries containing placeholders as well as for `sql/format` when used with `{ignoreTagless: false}` configuration.

## Rules

<!-- Rules are sorted alphabetically. -->

{"gitdown": "include", "file": "./rules/format.md"}
{"gitdown": "include", "file": "./rules/no-unsafe-query.md"}

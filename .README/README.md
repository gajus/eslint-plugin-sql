# eslint-plugin-sql

[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-sql/master.svg?style=flat-square)](https://travis-ci.org/gajus/eslint-plugin-sql)
[![Coveralls](https://img.shields.io/coveralls/gajus/eslint-plugin-sql.svg?style=flat-square)](https://coveralls.io/github/gajus/eslint-plugin-sql)
[![NPM version](http://img.shields.io/npm/v/eslint-plugin-sql.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-sql)
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
      "boolean"
    ]
  }
}
```

## Settings

N/A

## Rules

<!-- Rules are sorted alphabetically. -->

{"gitdown": "include", "file": "./rules/format.md"}
{"gitdown": "include", "file": "./rules/no-unsafe-query.md"}

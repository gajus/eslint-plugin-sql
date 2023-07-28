### `format`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).

This rule is used to format the queries using [pg-formatter](https://github.com/gajus/pg-formatter).

#### Options

The first option is an object with the following configuration.

|configuration|format|default|description|
|---|---|---|---|
|`ignoreBaseIndent`|boolean|`false`|Does not leave base indent before linting.|
|`ignoreExpressions`|boolean|`false`|Does not format template literals that contain expressions.|
|`ignoreInline`|boolean|`true`|Does not format queries that are written on a single line.|
|`ignoreTagless`|boolean|`true`|Does not format queries that are written without using `sql` tag.|
|`ignoreStartWithNewLine`|boolean|`true`|Does not remove `\n` at the beginning of queries.|

The second option is an object with the [`pg-formatter` configuration](https://github.com/gajus/pg-formatter#configuration).

<!-- assertions format -->

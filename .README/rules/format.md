### `format`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).

This rule is used to format the queries using [sql-formatter](https://github.com/sql-formatter-org/sql-formatter).

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
|`tabSize`|2|Number of spaces per indentation.|
|`language`|`sql`|Language of the query.|
|`keywordCase`|`preserve`|Determines the case of keywords (`preserve`, `upper`, `lower`).|
|`dataTypeCase`|`preserve`|Determines the case of data types (`preserve`, `upper`, `lower`).|
|`denseOperators`|`false`|Decides whitespace around operators.|
|`identifierCase`|`preserve`|Determines the case of identifiers (`preserve`, `upper`, `lower`).|
|`functionCase`|`preserve`|Determines the case of functions (`preserve`, `upper`, `lower`).|

<!-- assertions format -->

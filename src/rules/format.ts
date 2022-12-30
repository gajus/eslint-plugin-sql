import {
  generate,
} from 'astring';
import {
  format,
} from 'pg-formatter';
import isSqlQuery from '../utilities/isSqlQuery';

const create = (context) => {
  const placeholderRule = context.settings?.sql?.placeholderRule;

  const pluginOptions = context.options?.[0] || {};

  const ignoreExpressions = pluginOptions.ignoreExpressions === true;
  const ignoreInline = pluginOptions.ignoreInline !== false;
  const ignoreTagless = pluginOptions.ignoreTagless !== false;
  const ignoreStartWithNewLine = pluginOptions.ignoreStartWithNewLine !== false;
  const matchIndentation = pluginOptions.matchIndentation !== false;

  return {
    TemplateLiteral (node) {
      const tagName = node.parent.tag?.name ?? node.parent.tag?.object?.name ?? node.parent.tag?.callee?.object?.name;

      const sqlTagIsPresent = tagName === 'sql';

      if (ignoreTagless && !sqlTagIsPresent) {
        return;
      }

      if (ignoreExpressions && node.quasis.length !== 1) {
        return;
      }

      const magic = '"gajus-eslint-plugin-sql"';

      const literal = node.quasis
        .map((quasi) => {
          return quasi.value.raw;
        })
        .join(magic);

      if (!sqlTagIsPresent && !isSqlQuery(literal, placeholderRule)) {
        return;
      }

      if (ignoreInline && !literal.includes('\n')) {
        return;
      }

      let formatted = format(literal, context.options[1]);

      if (ignoreStartWithNewLine && literal.startsWith('\n') && !formatted.startsWith('\n')) {
        formatted = '\n' + formatted;
      }

      if (matchIndentation) {
        let firstNodeOnLine = node;

        while (
          firstNodeOnLine.parent &&
          firstNodeOnLine.loc.start.line === firstNodeOnLine.parent.loc.start.line
        ) {
          firstNodeOnLine = firstNodeOnLine.parent;
        }

        const startingColumn = firstNodeOnLine.loc.start.column;
        const formattedLines = formatted.split('\n');
        formatted = formattedLines
          .map((line, index) => {
            // Don't indent first line
            if (index === 0) {
              return line;
            }

            // Indent each subsequent line based on the spaces option
            let indentSpaces = context.options[1].spaces || 4;

            // Except for the last line, which is dedented once to make the backtick line up
            if (index === formattedLines.length - 1) {
              indentSpaces = 0;
            }

            const indentation = ' '.repeat(startingColumn + indentSpaces);
            return `${indentation}${line}`;
          })
          .join('\n');
      }

      if (formatted !== literal) {
        context.report({
          fix: (fixer) => {
            let final = formatted;

            const expressionCount = node.expressions.length;
            let index = 0;

            while (index <= expressionCount - 1) {
              final = final.replace(magic, '${' + generate(node.expressions[index]) + '}');

              index++;
            }

            return fixer.replaceTextRange([
              node.quasis[0].range[0],
              node.quasis[node.quasis.length - 1].range[1],
            ], '`\n' + final + '`');
          },
          message: 'Format the query',
          node,
        });
      }
    },
  };
};

export = {
  create,
  meta: {
    docs: {
      description: 'Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).',
      url: 'https://github.com/gajus/eslint-plugin-sql#eslint-plugin-sql-rules-format',
    },
    fixable: 'code',
    schema: [
      {
        additionalProperties: false,
        properties: {
          ignoreExpressions: {
            default: false,
            type: 'boolean',
          },
          ignoreInline: {
            default: true,
            type: 'boolean',
          },
          ignoreStartWithNewLine: {
            default: true,
            type: 'boolean',
          },
          ignoreTagless: {
            default: true,
            type: 'boolean',
          },
          matchIndentation: {
            default: true,
            type: 'boolean',
          },
        },
        type: 'object',
      },
      {
        additionalProperties: false,
        properties: {
          anonymize: {
            default: false,
            type: 'boolean',
          },
          commaBreak: {
            default: false,
            type: 'boolean',
          },
          functionCase: {
            default: 'lowercase',
            type: 'string',
          },
          keywordsCase: {
            default: 'lowercase',
            type: 'string',
          },
          noRcFile: {
            default: false,
            type: 'boolean',
          },
          spaces: {
            default: 2,
            type: 'number',
          },
          stripComments: {
            default: false,
            type: 'boolean',
          },
          tabs: {
            default: false,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
};

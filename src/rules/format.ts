import { indentString, stripIndent } from '../utilities/indent';
import isSqlQuery from '../utilities/isSqlQuery';
import { generate } from 'astring';
import { format } from 'pg-formatter';

const create = (context) => {
  const placeholderRule = context.settings?.sql?.placeholderRule;

  const pluginOptions = context.options?.[0] || {};

  const ignoreExpressions = pluginOptions.ignoreExpressions === true;
  const ignoreInline = pluginOptions.ignoreInline !== false;
  const ignoreTagless = pluginOptions.ignoreTagless !== false;
  const ignoreStartWithNewLine = pluginOptions.ignoreStartWithNewLine !== false;
  const matchIndentation = pluginOptions.matchIndentation !== false;

  return {
    TemplateLiteral(node) {
      const tagName =
        node.parent.tag?.name ??
        node.parent.tag?.object?.name ??
        node.parent.tag?.callee?.object?.name;

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

      const eolMatch = literal.match(/\r?\n/u);
      if (ignoreInline && !eolMatch) {
        return;
      }

      const [eol = '\n'] = eolMatch || [];

      const sourceCode = context.getSourceCode();
      const startLine = sourceCode.lines[node.loc.start.line - 1];
      const marginMatch = startLine.match(/^(\s*)\S/u);
      const parentMargin = marginMatch ? marginMatch[1] : '';

      const pgFormatterOptions = { ...context.options[1] };
      const { tabs, spaces = 4 } = pgFormatterOptions;

      const indent = tabs ? `\t` : ' '.repeat(spaces || 4);
      let formatted = format(literal, pgFormatterOptions).trim();

      if (matchIndentation) {
        const stripped = stripIndent(formatted);
        const trimmed = stripped.replaceAll(
          new RegExp(`^${eol}|${eol}[ \t]*$`, 'gu'),
          '',
        );
        const formattedLines = trimmed.split(eol);
        const indented =
          formattedLines
            .map((line) => {
              return parentMargin + indentString(line, 1, { indent });
            })
            .join(eol) +
          // The last line has an eol to make the backtick line up
          eol +
          parentMargin;

        formatted = indented;
      }

      const shouldPrependEol =
        ignoreStartWithNewLine && literal.startsWith(eol);

      if (shouldPrependEol && !formatted.startsWith(eol)) {
        formatted = eol + formatted;
      }

      if (formatted !== literal) {
        context.report({
          fix: (fixer) => {
            let final = formatted;

            const expressionCount = node.expressions.length;
            let index = 0;

            while (index <= expressionCount - 1) {
              final = final.replace(
                magic,
                '${' + generate(node.expressions[index]) + '}',
              );

              index++;
            }

            return fixer.replaceTextRange(
              [
                node.quasis[0].range[0],
                node.quasis[node.quasis.length - 1].range[1],
              ],
              `\`${shouldPrependEol && formatted.startsWith(eol) ? '' : '\n'}` +
                final +
                '`',
            );
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
      description:
        'Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).',
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

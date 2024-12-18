import { dropBaseIndent } from '../utilities/dropBaseIndent';
import { isSqlQuery } from '../utilities/isSqlQuery';
import { generate } from 'astring';
import { format } from 'pg-formatter';

const create = (context) => {
  const placeholderRule = context.settings?.sql?.placeholderRule;

  const pluginOptions = context.options?.[0] || {};

  const sqlTag = pluginOptions.sqlTag;
  const ignoreExpressions = pluginOptions.ignoreExpressions === true;
  const ignoreInline = pluginOptions.ignoreInline !== false;
  const ignoreTagless = pluginOptions.ignoreTagless !== false;
  const ignoreStartWithNewLine = pluginOptions.ignoreStartWithNewLine !== false;
  const ignoreBaseIndent = pluginOptions.ignoreBaseIndent === true;

  return {
    TemplateLiteral(node) {
      const tagName =
        node.parent.tag?.name ??
        node.parent.tag?.object?.name ??
        node.parent.tag?.callee?.object?.name;

      const sqlTagIsPresent = tagName === sqlTag;

      if (ignoreTagless && !sqlTagIsPresent) {
        return;
      }

      if (ignoreExpressions && node.quasis.length !== 1) {
        return;
      }

      const magic = '"gajus-eslint-plugin-sql"';

      let literal = node.quasis
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

      if (ignoreBaseIndent) {
        literal = dropBaseIndent(literal);
      }

      let formatted = format(literal, context.options[1]);

      if (
        ignoreStartWithNewLine &&
        literal.startsWith('\n') &&
        !formatted.startsWith('\n')
      ) {
        formatted = '\n' + formatted;
      }

      if (formatted.endsWith('\n\n')) {
        formatted = formatted.replace(/\n\n$/u, '\n');
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
              '`' + (final.startsWith('\n') ? final : '\n' + final) + '`',
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
          ignoreBaseIndent: {
            default: false,
            type: 'boolean',
          },
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
          sqlTag: {
            default: 'sql',
            type: 'string',
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
          keywordCase: {
            default: 'uppercase',
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

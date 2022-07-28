// @flow

import {
  generate,
} from 'astring';
import {
  format,
} from 'pg-formatter';
import isSqlQuery from '../utilities/isSqlQuery';

const create = (context) => {
  const placeholderRule = context.settings.sql && context.settings.sql.placeholderRule;

  const pluginOptions = context.options && context.options[0] || {};

  const ignoreExpressions = pluginOptions.ignoreExpressions === true;
  const ignoreInline = pluginOptions.ignoreInline !== false;
  const ignoreTagless = pluginOptions.ignoreTagless !== false;

  // const ignoreStartWithNewLine = pluginOptions.ignoreStartWithNewLine !== false;

  return {
    TemplateLiteral (node) {
      const sqlTagIsPresent = node.parent.tag && node.parent.tag.name === 'sql';

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

      let formatted = format(literal.trim(), context.options[1]);
      formatted = `\n${formatted}`;

      // if (literal.includes('EXIST') && !literal.includes('valid')) {
      //   console.log('fmt:', formatted);
      //   console.log('lt:', literal);
      // }

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
            ], '`' + final + '`');
          },
          message: 'Format the query',
          node,
        });
      }
    },
  };
};

export default {
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

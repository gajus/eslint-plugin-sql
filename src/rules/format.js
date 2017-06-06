// @flow

import {
  format
} from 'pg-formatter';
import {
  generate
} from 'astring';
import isSqlQuery from '../utilities/isSqlQuery';

export default (context) => {
  const pluginOptions = context.options && context.options[0] || {};

  const ignoreExpressions = pluginOptions.ignoreExpressions === true;
  const ignoreInline = pluginOptions.ignoreInline !== false;
  const ignoreTagless = pluginOptions.ignoreTagless !== false;

  return {
    TemplateLiteral (node) {
      if (ignoreTagless && !node.parent.tag) {
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

      if (!isSqlQuery(literal)) {
        return;
      }

      if (ignoreInline && !literal.includes('\n')) {
        return;
      }

      const formatted = format(literal, context.options[1]);

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
              node.quasis[node.quasis.length - 1].range[1]
            ], '`' + final + '`');
          },
          message: 'Format the query',
          node
        });
      }
    }
  };
};

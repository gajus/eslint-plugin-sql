// @flow

import {
  generate,
} from 'astring';
import {
  format,
} from 'pg-formatter';
import isSqlQuery from '../utilities/isSqlQuery';

export default (context) => {
  const placeholderRule = context.settings.sql && context.settings.sql.placeholderRule;

  const pluginOptions = context.options && context.options[0] || {};

  const ignoreExpressions = pluginOptions.ignoreExpressions === true;
  const ignoreInline = pluginOptions.ignoreInline !== false;
  const ignoreTagless = pluginOptions.ignoreTagless !== false;
  const ignoreStartWithNewLine = pluginOptions.ignoreStartWithNewLine !== false;
  const matchIndentation = pluginOptions.matchIndentation !== false;
  
  const pgFormatterOptions = context.options && context.options[1] || {};

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
            if (index === 0) return line;

            // Indent each subsequent line based on the spaces option
            let indentSpaces = context.options[1].spaces || 4;

            // Except for the last line, which is dedented once to make the backtick line up
            if (index === formattedLines.length - 1) indentSpaces = 0;

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

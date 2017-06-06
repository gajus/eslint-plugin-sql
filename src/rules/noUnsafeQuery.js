// @flow

import isSqlQuery from '../utilities/isSqlQuery';

export default (context) => {
  const allowLiteral = context.options && context.options[0] && context.options[0].allowLiteral;

  return {
    TemplateLiteral (node) {
      if (allowLiteral && node.quasis.length === 1) {
        return;
      }

      const literal = node.quasis
        .map((quasi) => {
          return quasi.value.raw;
        })
        .join('1');

      if (!isSqlQuery(literal)) {
        return;
      }

      if (!node.parent.tag || node.parent.tag.name !== 'sql') {
        context.report({
          message: 'Use "sql" tag',
          node
        });
      }
    }
  };
};

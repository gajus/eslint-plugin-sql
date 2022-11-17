import createDebug from 'debug';
import isSqlQuery from '../utilities/isSqlQuery';

const debug = createDebug('eslint-plugin-sql:rule:no-unsafe-query');

export default (context) => {
  const placeholderRule = context.settings?.sql?.placeholderRule;

  const {
    allowLiteral,
  } = context.options[0];

  return {
    TemplateLiteral (node) {
      if (allowLiteral && node.quasis.length === 1) {
        return;
      }

      const literal = node.quasis
        .map((quasi) => {
          return quasi.value.raw;
        })
        .join('foo');

      debug('input', literal);

      const recognizedAsQuery = isSqlQuery(literal, placeholderRule);

      debug('recognized as a query', recognizedAsQuery);

      if (!recognizedAsQuery) {
        return;
      }

      const {
        tag,
      } = node.parent;
      const legacyTagName = tag?.name.toLowerCase();
      const tagName = tag.property?.name.toLowerCase();

      if (legacyTagName !== 'sql' && tagName !== 'sql') {
        context.report({
          message: 'Use "sql" tag',
          node,
        });
      }
    },
  };
};

import isSqlQuery from '../utilities/isSqlQuery';
import createDebug from 'debug';

const debug = createDebug('eslint-plugin-sql:rule:no-unsafe-query');

const defaultOptions = {
  allowLiteral: false,
};

const create = (context) => {
  const placeholderRule = context.settings?.sql?.placeholderRule;

  const { allowLiteral } = context.options[0] ?? defaultOptions;

  return {
    TemplateLiteral(node) {
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

      const tagName =
        node.parent.tag?.name ??
        node.parent.tag?.object?.name ??
        node.parent.tag?.callee?.object?.name;

      const legacyTagName = node.parent.name?.toLowerCase();

      if (legacyTagName !== 'sql' && tagName !== 'sql') {
        context.report({
          message: 'Use "sql" tag',
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
        'Disallows use of SQL inside of template literals without the `sql` tag.',
      url: 'https://github.com/gajus/eslint-plugin-sql#no-unsafe-query',
    },
    fixable: 'code',
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowLiteral: {
            default: false,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
};

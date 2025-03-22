import { createRule } from '../factories/createRule.js';
import { isSqlQuery } from '../utilities/isSqlQuery.js';
import createDebug from 'debug';

const debug = createDebug('eslint-plugin-sql:rule:no-unsafe-query');

const defaultOptions = {
  allowLiteral: false,
  sqlTag: 'sql',
};

type MessageIds = 'noUnsafeQuery';

type Options = [
  {
    allowLiteral?: boolean;
    sqlTag?: string;
  },
];

export const rule = createRule<Options, MessageIds>({
  create: (context) => {
    // @ts-expect-error I am ont clear how to type this
    const placeholderRule = context.settings?.sql?.placeholderRule;

    const pluginOptions = context.options?.[0] || {};

    const sqlTag = pluginOptions.sqlTag ?? defaultOptions.sqlTag;
    const allowLiteral =
      pluginOptions.allowLiteral ?? defaultOptions.allowLiteral;

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
          // @ts-expect-error TODO
          node.parent.tag?.name ??
          // @ts-expect-error TODO
          node.parent.tag?.object?.name ??
          // @ts-expect-error TODO
          node.parent.tag?.callee?.object?.name;

        // @ts-expect-error TODO
        const legacyTagName = node.parent?.name?.toLowerCase();

        if (legacyTagName !== sqlTag && tagName !== sqlTag) {
          context.report({
            data: {
              sqlTag,
            },
            messageId: 'noUnsafeQuery',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [
    {
      allowLiteral: false,
      sqlTag: 'sql',
    },
  ],
  meta: {
    docs: {
      description:
        'Disallows use of SQL inside of template literals without the `sql` tag.',
      url: 'https://github.com/gajus/eslint-plugin-sql#no-unsafe-query',
    },
    fixable: 'code',
    messages: {
      noUnsafeQuery: 'Use "{{sqlTag}}" tag',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowLiteral: {
            default: false,
            type: 'boolean',
          },
          sqlTag: {
            default: 'sql',
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-unsafe-query',
});

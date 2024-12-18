import { createRule } from '../factories/createRule';
import { dropBaseIndent } from '../utilities/dropBaseIndent';
import { isSqlQuery } from '../utilities/isSqlQuery';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { generate } from 'astring';
import { format } from 'pg-formatter';

type MessageIds = 'format';

type Options = [
  {
    ignoreExpressions?: boolean;
    ignoreInline?: boolean;
    ignoreStartWithNewLine?: boolean;
    ignoreTagless?: boolean;
    retainBaseIndent?: boolean;
    sqlTag?: string;
  },
  {
    anonymize?: boolean;
    commaBreak?: boolean;
    functionCase?: 'lowercase' | 'uppercase';
    keywordCase?: 'lowercase' | 'uppercase';
    noRcFile?: boolean;
    spaces?: number;
    stripComments?: boolean;
    tabs?: boolean;
  },
];

const padIndent = (subject: string, spaces: number) => {
  return subject
    .split('\n')
    .map((line) => {
      return line.length > 0 ? ' '.repeat(spaces) + line : line;
    })
    .join('\n');
};

const findFirstMeaningfulIndent = (subject: string) => {
  for (const line of subject.split('\n')) {
    if (line.trim().length > 0) {
      return line.search(/\S/u);
    }
  }

  return 0;
};

export const rule = createRule<Options, MessageIds>({
  create: (context) => {
    // @ts-expect-error I am ont clear how to type this
    const placeholderRule = context.settings?.sql?.placeholderRule;

    const pluginOptions = context.options?.[0] || {
      ignoreExpressions: false,
      ignoreInline: true,
      ignoreStartWithNewLine: true,
      ignoreTagless: true,
      retainBaseIndent: true,
      sqlTag: 'sql',
    };

    const {
      ignoreExpressions,
      ignoreInline,
      ignoreStartWithNewLine,
      ignoreTagless,
      retainBaseIndent,
      sqlTag,
    } = pluginOptions;

    const spaces = context.options?.[1]?.spaces ?? 2;

    return {
      TemplateLiteral(node) {
        const tagName =
          // @ts-expect-error TODO
          node.parent.tag?.name ??
          // @ts-expect-error TODO
          node.parent.tag?.object?.name ??
          // @ts-expect-error TODO
          node.parent.tag?.callee?.object?.name;

        const sqlTagIsPresent = tagName === sqlTag;

        const templateElement = node.quasis.find((quasi) => {
          return quasi.type === AST_NODE_TYPES.TemplateElement;
        });

        if (!templateElement) {
          return;
        }

        let indentAnchorOffset = findFirstMeaningfulIndent(
          templateElement.value.raw,
        );

        if (templateElement.value.raw.search(/\S/u) === 0) {
          indentAnchorOffset = spaces;
        }

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

        let formatted = format(literal, {
          ...context.options[1],
          spaces,
        });

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

        if (retainBaseIndent) {
          formatted = padIndent(formatted, indentAnchorOffset);
        } else {
          literal = dropBaseIndent(literal);
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
            messageId: 'format',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [
    {
      ignoreExpressions: false,
      ignoreInline: true,
      ignoreStartWithNewLine: true,
      ignoreTagless: true,
      retainBaseIndent: true,
      sqlTag: 'sql',
    },
    {
      anonymize: false,
      commaBreak: false,
      functionCase: 'lowercase',
      keywordCase: 'uppercase',
      noRcFile: false,
      spaces: 2,
      stripComments: false,
      tabs: false,
    },
  ],
  meta: {
    docs: {
      description:
        'Matches queries in template literals. Warns when query formatting does not match the configured format (see Options).',
      url: 'https://github.com/gajus/eslint-plugin-sql#eslint-plugin-sql-rules-format',
    },
    fixable: 'code',
    messages: {
      format: 'Format the query',
    },
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
          retainBaseIndent: {
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
  name: 'format',
});

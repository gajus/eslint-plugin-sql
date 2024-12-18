import { createRule } from '../factories/createRule';
import { dropBaseIndent } from '../utilities/dropBaseIndent';
import { isSqlQuery } from '../utilities/isSqlQuery';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { generate } from 'astring';
import { format } from 'pg-formatter';

type MessageIds = 'format';

type Options = [
  {
    alignIndent?: boolean;
    ignoreBaseIndent?: boolean;
    ignoreExpressions?: boolean;
    ignoreInline?: boolean;
    ignoreStartWithNewLine?: boolean;
    ignoreTagless?: boolean;
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

export const rule = createRule<Options, MessageIds>({
  create: (context) => {
    // @ts-expect-error I am ont clear how to type this
    const placeholderRule = context.settings?.sql?.placeholderRule;

    const pluginOptions = context.options?.[0] || {};

    const alignIndent = pluginOptions.alignIndent === true;
    const sqlTag = pluginOptions.sqlTag ?? 'sql';
    const ignoreExpressions = pluginOptions.ignoreExpressions === true;
    const ignoreInline = pluginOptions.ignoreInline !== false;
    const ignoreTagless = pluginOptions.ignoreTagless !== false;
    const ignoreStartWithNewLine =
      pluginOptions.ignoreStartWithNewLine !== false;
    const ignoreBaseIndent = pluginOptions.ignoreBaseIndent === true;

    const spaces = context.options?.[1]?.spaces ?? 4;

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

        let indentAnchorOffset = node.loc.start.column;

        if (node.parent.type === AST_NODE_TYPES.TaggedTemplateExpression) {
          indentAnchorOffset = node.parent.loc.start.column;
        }

        indentAnchorOffset += spaces;

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

        if (alignIndent) {
          formatted = padIndent(formatted, indentAnchorOffset);
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
      alignIndent: true,
      ignoreBaseIndent: false,
      ignoreExpressions: false,
      ignoreInline: true,
      ignoreStartWithNewLine: true,
      ignoreTagless: true,
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
          alignIndent: {
            default: false,
            type: 'boolean',
          },
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
  name: 'format',
});

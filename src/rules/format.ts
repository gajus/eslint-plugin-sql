import { createRule } from '../factories/createRule.js';
import { dropBaseIndent } from '../utilities/dropBaseIndent.js';
import { isSqlQuery } from '../utilities/isSqlQuery.js';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { format } from 'sql-formatter';

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
    dataTypeCase?: 'lower' | 'preserve' | 'upper';
    denseOperators?: boolean;
    functionCase?: 'lower' | 'preserve' | 'upper';
    identifierCase?: 'lower' | 'preserve' | 'upper';
    keywordCase?: 'lower' | 'preserve' | 'upper';
    language?:
      | 'bigquery'
      | 'db2'
      | 'db2i'
      | 'hive'
      | 'mariadb'
      | 'mysql'
      | 'n1ql'
      | 'plsql'
      | 'postgresql'
      | 'redshift'
      | 'singlestoredb'
      | 'snowflake'
      | 'spark'
      | 'sql'
      | 'sqlite'
      | 'tidb'
      | 'transactsql'
      | 'trino'
      | 'tsql';
    tabWidth?: number;
    useTabs?: boolean;
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

    const tabWidth = context.options?.[1]?.tabWidth ?? 2;

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

        if (ignoreTagless && !sqlTagIsPresent) {
          return;
        }

        if (ignoreExpressions && node.quasis.length !== 1) {
          return;
        }

        const templateElement = node.quasis.find((quasi) => {
          return quasi.type === AST_NODE_TYPES.TemplateElement;
        });

        if (!templateElement) {
          return;
        }

        let indentAnchorOffset = findFirstMeaningfulIndent(
          templateElement.value.raw,
        );

        if (templateElement.value.raw.search(/\S/u) === -1) {
          const lines = templateElement.value.raw.split('\n');

          const lastLine = lines[lines.length - 1];

          if (lastLine) {
            indentAnchorOffset = lastLine.length;
          } else {
            indentAnchorOffset = 0;
          }
        } else if (templateElement.value.raw.search(/\S/u) === 0) {
          indentAnchorOffset = tabWidth;
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

        let formatted = format(literal, {
          ...context.options[1],
          tabWidth,
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
          formatted = dropBaseIndent(literal);
        }

        formatted +=
          '\n' + ' '.repeat(Math.max(indentAnchorOffset - tabWidth, 0));

        if (formatted !== literal) {
          context.report({
            fix: (fixer) => {
              let final = formatted;

              const expressionCount = node.expressions.length;

              let index = 0;

              while (index <= expressionCount - 1) {
                final = final.replace(
                  magic,
                  '${' +
                    context.sourceCode.getText(node.expressions[index]) +
                    '}',
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
      tabWidth: 2,
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
          dataTypeCase: {
            default: 'preserve',
            enum: ['lower', 'upper', 'preserve'],
            type: 'string',
          },
          denseOperators: {
            default: false,
            type: 'boolean',
          },
          functionCase: {
            default: 'preserve',
            enum: ['lower', 'upper', 'preserve'],
            type: 'string',
          },
          identifierCase: {
            default: 'preserve',
            enum: ['lower', 'upper', 'preserve'],
            type: 'string',
          },
          keywordCase: {
            default: 'preserve',
            enum: ['lower', 'upper', 'preserve'],
            type: 'string',
          },
          language: {
            default: 'sql',
            type: 'string',
          },
          tabWidth: {
            default: 2,
            type: 'number',
          },
          useTabs: {
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

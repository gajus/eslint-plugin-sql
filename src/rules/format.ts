import { createRule } from '../factories/createRule.js';
import { dropBaseIndent } from '../utilities/dropBaseIndent.js';
import { isSqlQuery } from '../utilities/isSqlQuery.js';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { format } from 'sql-formatter';

type MessageIds = 'format' | 'parseError';

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
    paramTypes?: {
      custom?: Array<{ regex: string }>;
      named?: Array<'$' | ':' | '@'>;
      numbered?: Array<'$' | ':' | '?'>;
      positional?: boolean;
      quoted?: Array<'$' | ':' | '@'>;
    };
    tabWidth?: number;
    useTabs?: boolean;
  },
];

const padIndent = (
  subject: string,
  indentString: string,
  indentCount: number,
) => {
  return subject
    .split('\n')
    .map((line) => {
      return line.length > 0 ? indentString.repeat(indentCount) + line : line;
    })
    .join('\n');
};

type IndentInfo = {
  char: ' ' | '\t';
  count: number;
};

const detectIndentation = (subject: string): IndentInfo => {
  for (const line of subject.split('\n')) {
    if (line.trim().length > 0) {
      const match = line.match(/^(\t+|\u0020+)/u);
      if (match) {
        const leadingWhitespace = match[1];
        return {
          char: leadingWhitespace[0] === '\t' ? '\t' : ' ',
          count: leadingWhitespace.length,
        };
      }

      return { char: ' ', count: 0 };
    }
  }

  return { char: ' ', count: 0 };
};

const getClosingIndentation = (subject: string): IndentInfo => {
  const lines = subject.split('\n');
  const lastLine = lines[lines.length - 1];

  if (lastLine && lastLine.trim().length === 0 && lastLine.length > 0) {
    const char = lastLine[0] === '\t' ? '\t' : ' ';
    return { char, count: lastLine.length };
  }

  return { char: ' ', count: 0 };
};

type IndentConfig = {
  char: ' ' | '\t';
  closingCount: number;
  contentCount: number;
};

const calculateIndentConfig = (
  templateRaw: string,
  useTabs: boolean | undefined,
  tabWidth: number,
): IndentConfig => {
  // Detect the original indentation style from the template
  let detectedIndent = detectIndentation(templateRaw);

  // If no meaningful content, try to detect from the closing line
  const hasNoContent = templateRaw.search(/\S/u) === -1;
  if (hasNoContent) {
    detectedIndent = getClosingIndentation(templateRaw);
  }

  // Determine the indent character to use:
  // 1. If useTabs is explicitly set, use that
  // 2. Otherwise, use the detected indentation from the original template
  const indentChar: ' ' | '\t' =
    useTabs === undefined ? detectedIndent.char : useTabs ? '\t' : ' ';

  // Calculate the indent count for the SQL content
  let contentCount: number;
  if (hasNoContent) {
    // No meaningful content - use closing line indentation + 1 level
    contentCount =
      indentChar === '\t'
        ? detectedIndent.count + 1
        : detectedIndent.count + tabWidth;
  } else if (templateRaw.search(/\S/u) === 0) {
    // Content starts immediately (no leading whitespace)
    contentCount = indentChar === '\t' ? 1 : tabWidth;
  } else {
    // Use detected indentation
    contentCount = detectedIndent.count;
  }

  // Calculate closing backtick indentation (one level less than content)
  const closingCount =
    indentChar === '\t'
      ? Math.max(contentCount - 1, 0)
      : Math.max(contentCount - tabWidth, 0);

  return {
    char: indentChar,
    closingCount,
    contentCount,
  };
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
    const useTabs = context.options?.[1]?.useTabs;

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

        const magic = '"gajus-eslint-plugin-sql"';

        const literal = node.quasis
          .map((quasi) => {
            return quasi.value.raw;
          })
          .join(magic);

        const indentConfig = calculateIndentConfig(literal, useTabs, tabWidth);

        if (!sqlTagIsPresent && !isSqlQuery(literal, placeholderRule)) {
          return;
        }

        if (ignoreInline && !literal.includes('\n')) {
          return;
        }

        let formatted: string;
        try {
          formatted = format(literal, {
            ...context.options[1],
            tabWidth,
          });
        } catch (error) {
          context.report({
            data: {
              message:
                error instanceof Error ? error.message : 'Unknown parse error',
            },
            messageId: 'parseError',
            node,
          });
          return;
        }

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
          formatted = padIndent(
            formatted,
            indentConfig.char,
            indentConfig.contentCount,
          );
          formatted +=
            '\n' + indentConfig.char.repeat(indentConfig.closingCount);
        } else {
          formatted = dropBaseIndent(formatted);
          formatted += '\n';
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
      parseError: 'SQL parse error: {{message}}',
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
          paramTypes: {
            additionalProperties: false,
            properties: {
              custom: {
                items: {
                  additionalProperties: false,
                  properties: {
                    regex: {
                      type: 'string',
                    },
                  },
                  required: ['regex'],
                  type: 'object',
                },
                type: 'array',
              },
              named: {
                items: {
                  enum: [':', '@', '$'],
                  type: 'string',
                },
                type: 'array',
              },
              numbered: {
                items: {
                  enum: ['?', ':', '$'],
                  type: 'string',
                },
                type: 'array',
              },
              positional: {
                type: 'boolean',
              },
              quoted: {
                items: {
                  enum: [':', '@', '$'],
                  type: 'string',
                },
                type: 'array',
              },
            },
            type: 'object',
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

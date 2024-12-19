import * as Utils from '@typescript-eslint/utils';

export const createRule = Utils.ESLintUtils.RuleCreator((name) => {
  return `https://github.com/gajus/eslint-plugin-sql#eslint-plugin-sql-rules-${name}`;
});

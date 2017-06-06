// @flow

import parser from 'sql-parse';

export default (literal: string, ignorePattern: string): boolean => {
  if (!literal) {
    return false;
  }

  let maybeSql = literal;

  if (ignorePattern) {
    maybeSql = maybeSql.replace(new RegExp(ignorePattern, 'g'), 'foo');
  }

  try {
    parser.parse(maybeSql);
  } catch (error) {
    return false;
  }

  return true;
};

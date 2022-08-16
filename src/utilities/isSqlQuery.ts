import parser from 'sql-parse';

export default (literal: string, ignorePattern?: string): boolean => {
  if (!literal) {
    return false;
  }

  let maybeSql = literal;

  if (ignorePattern) {
    maybeSql = maybeSql.replace(new RegExp(ignorePattern, 'ug'), 'foo');
  }

  try {
    parser.parse(maybeSql);
  } catch {
    return false;
  }

  return true;
};

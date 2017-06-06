// @flow

import parser from 'sql-parse';

export default (literal: string): boolean => {
  if (!literal) {
    return false;
  }

  try {
    parser.parse(literal);
  } catch (error) {
    return false;
  }

  return true;
};

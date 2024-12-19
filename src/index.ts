import { rule as format } from './rules/format';
import { rule as noUnsafeQuery } from './rules/noUnsafeQuery';

const rules = {
  format,
  'no-unsafe-query': noUnsafeQuery,
};

export = {
  rules,
  rulesConfig: {
    format: 0,
    'no-unsafe-query': 0,
  },
};

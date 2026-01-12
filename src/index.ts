import { rule as format } from './rules/format.js';
import { rule as noUnsafeQuery } from './rules/noUnsafeQuery.js';

const rules = {
  format,
  'no-unsafe-query': noUnsafeQuery,
};

export default {
  rules,
  rulesConfig: {
    format: 0,
    'no-unsafe-query': 0,
  },
};

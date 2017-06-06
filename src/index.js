// @flow

import format from './rules/format';
import noUnsafeQuery from './rules/noUnsafeQuery';

const rules = {
  format,
  'no-unsafe-query': noUnsafeQuery
};

export default {
  rules,
  rulesConfig: {
    format: 0,
    'no-unsafe-query': 0
  }
};

import pkg from '../package.json';
import { rule as format } from './rules/format.js';
import { rule as noUnsafeQuery } from './rules/noUnsafeQuery.js';
import { type Linter } from 'eslint';

const rules = {
  format,
  'no-unsafe-query': noUnsafeQuery,
};

const plugin = {
  configs: {} as Record<string, Linter.Config | Linter.FlatConfig>,
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules,
};

Object.assign(plugin.configs, {
  'legacy-recommended': {
    plugins: ['sql'],
    rules: {
      'sql/format': 'error',
      'sql/no-unsafe-query': 'error',
    },
  },
  recommended: {
    plugins: {
      sql: plugin,
    },
    rules: {
      'sql/format': 'error',
      'sql/no-unsafe-query': 'error',
    },
  },
});

export default plugin;

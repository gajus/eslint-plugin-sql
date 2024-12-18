const auto = require('eslint-config-canonical/configurations/auto');

module.exports = [
  ...auto,
  {
    rules: {
      'no-template-curly-in-string': 0,
    },
  },
  {
    ignores: [
      'package-lock.json',
      'dist',
      'node_modules',
      '*.log',
      '.*',
      '!.github',
      '!.gitignore',
      '!.husky',
      '!.releaserc',
    ],
  },
];

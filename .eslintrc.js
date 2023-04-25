module.exports = {
  extends: ['canonical/auto', 'canonical/node'],
  ignorePatterns: ['dist', 'package-lock.json'],
  root: true,
  rules: {
    'no-template-curly-in-string': 0,
    'node/no-sync': 0,
  },
};

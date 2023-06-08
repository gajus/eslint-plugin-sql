module.exports = {
  extends: ['canonical/auto', 'canonical/node'],
  ignorePatterns: ['dist', 'package-lock.json', 'node_modules'],
  root: true,
  rules: {
    'complexity': 0,
    'no-template-curly-in-string': 0,
    'node/no-sync': 0,
  },
};

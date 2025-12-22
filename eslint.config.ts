import auto from 'eslint-config-canonical/auto';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  auto,
  {
    rules: {
      'no-template-curly-in-string': 0,
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: false,
        },
      ],
    },
  },
  {
    files: ['**/index.[jt]s'],
    rules: {
      'canonical/filename-match-exported': 0,
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
  {
    languageOptions: {
      globals: globals.mocha,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);

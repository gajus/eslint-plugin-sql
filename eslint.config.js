import auto from 'eslint-config-canonical/configurations/auto.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  auto,
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
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);

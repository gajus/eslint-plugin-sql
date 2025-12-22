import auto from 'eslint-config-canonical/auto';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  auto,
  {
    rules: {
      'no-template-curly-in-string': 0,
    },
  },
  {
    files: ['src/index.ts'],
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
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);

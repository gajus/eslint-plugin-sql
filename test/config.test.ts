import plugin from '../src/index.js';
import { ESLint } from 'eslint';
import assert from 'node:assert';

describe('Integration: Configs', () => {
  it('should report errors with recommended config (Flat)', async () => {
    const eslint = new ESLint({
      overrideConfig: [
        plugin.configs['flat/recommended'],
        {
          files: ['**'],
          languageOptions: {
            parserOptions: {
              ecmaVersion: 'latest',
            },
          },
        },
      ],
      overrideConfigFile: 'test/empty.config.js',
    });

    const code = 'const q = `SELECT * FROM users`;';
    const results = await eslint.lintText(code, { filePath: 'test.ts' });

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].errorCount, 1);
    assert.strictEqual(results[0].messages[0].ruleId, 'sql/no-unsafe-query');
  });
});

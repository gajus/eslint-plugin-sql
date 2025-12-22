import plugin from '../src/index.js';
import assert from 'node:assert';
import type { Linter } from 'eslint';

describe('plugin', () => {
    it('exports meta', () => {
        assert.strictEqual(plugin.meta.name, 'eslint-plugin-sql');
        assert.ok(plugin.meta.version);
    });

    it('exports rules', () => {
        assert.ok(plugin.rules.format);
        assert.ok(plugin.rules['no-unsafe-query']);
    });

    it('exports configs.recommended', () => {
        const recommended = plugin.configs.recommended as Linter.FlatConfig;
        assert.ok(recommended);
        // Flat config structure
        assert.ok(recommended.plugins);
        assert.strictEqual(recommended.plugins['sql'], plugin);
        assert.ok(recommended.rules);
        assert.strictEqual(recommended.rules['sql/format'], 'error');
        assert.strictEqual(recommended.rules['sql/no-unsafe-query'], 'error');
    });

    it('exports configs.legacy-recommended', () => {
        const legacy = plugin.configs['legacy-recommended'] as Linter.Config;
        assert.ok(legacy);
        // Legacy config structure
        assert.deepStrictEqual(legacy.plugins, ['sql']);
        assert.ok(legacy.rules);
        assert.strictEqual(legacy.rules['sql/format'], 'error');
        assert.strictEqual(legacy.rules['sql/no-unsafe-query'], 'error');
    });
});

const assert = require('node:assert');
const path = require('node:path');

describe('CJS Build Artifact', () => {
    it('can be required without error', () => {
        const plugin = require('../dist/index.cjs');
        assert.ok(plugin);
    });

    it('exports configs and rules', () => {
        const plugin = require('../dist/index.cjs');
        assert.ok(plugin.configs);
        assert.ok(plugin.rules);
        assert.ok(plugin.configs.recommended);
        assert.ok(plugin.configs['legacy-recommended']);
    });
});

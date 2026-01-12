import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    outDir: 'dist',
    target: 'node16',
    footer: {
        js: 'if (typeof module !== "undefined" && module.exports && module.exports.default) { module.exports = module.exports.default; }',
    },
});

import { dropBaseIndent } from './dropBaseIndent.js';
import multiline from 'multiline-ts';
import assert from 'node:assert';

describe('dropBaseIndent', () => {
  it('drops base indent', () => {
    assert.strictEqual(
      dropBaseIndent(multiline`
        SELECT
          1
      `),
      multiline`
        SELECT
          1
      `,
    );
  });
});

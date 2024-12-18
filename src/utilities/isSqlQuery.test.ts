/* global describe */
/* global it */

import { isSqlQuery } from './isSqlQuery';
import assert from 'node:assert';

describe('isSqlQuery', () => {
  it('recognizes SQL input', () => {
    assert(isSqlQuery('SELECT 1'));
  });
  it('recognizes SQL input after ignoring defined patterns', () => {
    assert(isSqlQuery('SELECT ? FROM bar', '\\?'));
  });
  it('distinguishes from non-SQL input', () => {
    assert(!isSqlQuery('foo bar'));
    assert(!isSqlQuery('foo SELECT FROM bar'));
  });
});

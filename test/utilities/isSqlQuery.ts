/* global describe */
/* global it */

import assert from 'assert';
import isSqlQuery from '../../src/utilities/isSqlQuery';

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

/* global describe */
/* global it */

import { indentString, stripIndent } from '../../src/utilities/indent';
import assert from 'node:assert';

describe('indentString', () => {
  it('should indent each line in a string', () => {
    assert(indentString('foo\nbar') === ' foo\n bar');
    assert(indentString('foo\nbar', 1) === ' foo\n bar');
    assert(indentString('foo\r\nbar', 1) === ' foo\r\n bar');
    assert(indentString('foo\nbar', 4) === '    foo\n    bar');
  });
  it('should not indent whitespace only lines', () => {
    assert(indentString('foo\nbar\n', 1) === ' foo\n bar\n');
    assert(
      indentString('foo\nbar\n', 1, { includeEmptyLines: false }) ===
        ' foo\n bar\n',
    );
  });
  it('should indent every line if options.includeEmptyLines is true', () => {
    assert(
      indentString('foo\n\nbar\n\t', 1, { includeEmptyLines: true }) ===
        ' foo\n \n bar\n \t',
    );
  });
  it('should indent with leading whitespace', () => {
    assert(
      indentString('foo\n\nbar\n\t', 1, { includeEmptyLines: true }) ===
        ' foo\n \n bar\n \t',
    );
  });
  it('should indent with custom string', () => {
    assert(indentString('foo\nbar\n', 1, { indent: '♥' }) === '♥foo\n♥bar\n');
  });
  it('should not indent when count is 0', () => {
    assert(indentString('foo\nbar\n', 0) === 'foo\nbar\n');
  });
});

describe('stripIndent', () => {
  it('should strip leading whitespace from each line in a string', () => {
    assert(stripIndent('') === '');
    assert(stripIndent('\nunicorn\n') === '\nunicorn\n');
    assert(stripIndent('\n  unicorn\n') === '\nunicorn\n');
    assert(
      stripIndent(
        '\t\t<!doctype html>\n\t\t<html>\n\t\t\t<body>\n\n\n\n\t\t\t\t<h1>Hello world!</h1>\n\t\t\t</body>\n\t\t</html>',
      ) ===
        '<!doctype html>\n<html>\n\t<body>\n\n\n\n\t\t<h1>Hello world!</h1>\n\t</body>\n</html>',
    );
    assert(
      stripIndent('\n\t\n\t\tunicorn\n\n\n\n\t\t\tunicorn') ===
        '\n\t\nunicorn\n\n\n\n\tunicorn',
      'ignore whitespace only lines',
    );
  });
});

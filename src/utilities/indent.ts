type IndentOptions = {
  includeEmptyLines?: boolean;
  indent?: string;
};

const minIndent = function (string: string): number {
  const match = string.match(/^[\t ]*(?=\S)/gmu);

  if (!match) {
    return 0;
  }

  let min = Number.POSITIVE_INFINITY;

  for (const indent of match) {
    min = Math.min(min, indent.length);
  }

  return min;
};

export const stripIndent = function (string: string): string {
  const indent = minIndent(string);

  if (indent === 0) {
    return string;
  }

  const regex = new RegExp(`^[ \\t]{${indent}}`, 'gmu');

  return string.replace(regex, '');
};

export const indentString = function (
  string: string,
  count: number = 1,
  options: IndentOptions = {},
): string {
  const { indent = ' ', includeEmptyLines = false } = options;

  if (count === 0) {
    return string;
  }

  const regex = includeEmptyLines ? /^/gmu : /^(?!\s*$)/gmu;

  return string.replace(regex, indent.repeat(count));
};

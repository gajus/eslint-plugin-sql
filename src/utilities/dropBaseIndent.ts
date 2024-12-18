// based on https://github.com/sindresorhus/strip-indent
export const dropBaseIndent = (raw: string) => {
  const trimmedString = raw.replace(/ *$/u, '');

  const matches = trimmedString.match(/^[\t ]*(?=\S)/gmu);
  if (!matches) return trimmedString;

  const indent = Math.min(...matches.map((match) => match.length));
  if (!indent) return trimmedString;

  return trimmedString.replaceAll(new RegExp(`^[ \\t]{${indent}}`, 'gmu'), '');
};

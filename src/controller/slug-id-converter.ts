export function convertIdToSlug(id: number, name: string, prefix: string): string {
  let slug: string = slugify(name) + '-' + prefix;
  let idAndSlugValue: number = id + calcStringSum(slug);
  return slug + idAndSlugValue.toString(20);
}

export function convertSlugToId(slug: string): number {
  let lastPartPos: number = slug.lastIndexOf('-');
  let nameAndPrefixPart: string = slug.substring(0, lastPartPos + 2);
  let idPart: string = slug.substring(lastPartPos + 2);
  let slugAndPrefixValue: number = calcStringSum(nameAndPrefixPart);
  return parseInt(idPart, 20) - slugAndPrefixValue;
}

function calcStringSum(s: string): number {
  let value: number = 0;
  for (let i: number = 0; i < s.length; ++i) {
    value += s.charCodeAt(i);
  }
  return value;
}

function slugify(string: string) {
  const a: string = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
  const b: string = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p: RegExp = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
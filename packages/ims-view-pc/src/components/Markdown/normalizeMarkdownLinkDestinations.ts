/**
 * CommonMark：链接目标含空白时须写成 [text](<url with spaces>)，
 * 否则解析失败会把整段 `[...](...)` 当纯文本。知识库相对路径常含空格，渲染前自动补 `<>`。
 */
export function normalizeMarkdownLinkDestinations(markdown: string): string {
  if (!markdown || !markdown.includes('](')) return markdown;

  return markdown.replace(/\[([^\]]*)]\(([^)\n]+)\)/g, (match, label: string, destination: string) => {
    const dest = destination.trim();
    if (!dest || dest.startsWith('<')) return match;
    if (!/\s/.test(dest)) return match;

    // [text](url "title") / [text](url 'title')：仅 url 段含空格时包起来
    const withTitle = dest.match(/^(.*?)\s+("(?:\\.|[^"])*"|'(?:\\.|[^'])*')\s*$/);
    if (withTitle) {
      const urlPart = withTitle[1].trim();
      const titlePart = withTitle[2];
      if (!urlPart || !/\s/.test(urlPart)) return match;
      return `[${label}](<${urlPart}> ${titlePart})`;
    }

    return `[${label}](<${dest}>)`;
  });
}

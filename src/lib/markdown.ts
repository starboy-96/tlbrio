import { Marked } from "marked";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;

// Posts are AI-written, so raw HTML is shown as text and only ordinary links are kept.
const md = new Marked({ gfm: true });
md.use({
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      if (!SAFE_HREF.test(href)) return label;
      const external = /^https?:/i.test(href) && !/^https?:\/\/(www\.)?tlbr\.io/i.test(href);
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(href)}"${titleAttr}${target}>${label}</a>`;
    },
    image({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(source: string, title?: string): string {
  const body = title
    ? source.replace(/^\s*# (.+)\n+/, (line, heading: string) =>
        heading.trim().toLowerCase() === title.trim().toLowerCase() ? "" : line,
      )
    : source;
  return md.parse(body, { async: false });
}

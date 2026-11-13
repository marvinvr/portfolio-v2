import { parse } from 'node-html-parser';
import { getHighlighter } from 'shiki';
const THEME = 'github-dark';

/**
 * Returns code with curly braces and backticks replaced by HTML entity equivalents
 * @param {string} code - highlighted HTML
 * @returns {string} - escaped HTML
 */
function escapeHtml(code) {
  /** @type {Record<string, string>} */
  const entities = { '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' };
  return code.replace(
    /[{}`]/g,
    (character) => entities[character],
  );
}

/**
 * Returns array of line numbers to be highlghted
 * @param {string} rangeString - range string to be parsed (e.g. {1,3-5,8})
 * @returns {number[]}
 */
function rangeParser(rangeString) {
  /** @type {number[]} */
  const result = [];
  const ranges = rangeString.split(',');
  ranges.forEach((element) => {
    if (element.indexOf('-') === -1) {
      result.push(parseInt(element, 10));
    } else {
      const limits = element.split('-');
      const start = parseInt(limits[0], 10);
      const end = parseInt(limits[1], 10);
      for (let i = start; i <= end; i += 1) {
        result.push(i);
      }
    }
  });
  return result;
}

/**
 * @param html {string} - code to highlight
 * @returns {string} - highlighted html
 */
function makeFocussable(html) {
  const root = parse(html);
  const pre = root.querySelector('pre');
  if (pre) {
    pre.setAttribute('tabIndex', '0');
    pre.setAttribute('role', 'region');
    pre.setAttribute('aria-label', 'Code example');
  }
  // Svelte flags focusable <pre> elements, but keyboard users need to scroll code.
  return '<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable code examples need keyboard focus.) -->' + root.toString();
}

/**
 * @param code {string} - code to highlight
 * @param lang {string} - code language
 * @param meta {string} - code meta
 * @returns {Promise<string>} - highlighted html
 */
async function highlighter(code, lang, meta) {
  const shikiHighlighter = await getHighlighter({
    theme: THEME,
  });

  const highlightMeta = meta && /{([\d,-]+)}/.exec(meta);
  let html;
  if (!highlightMeta) {
    html = shikiHighlighter.codeToHtml(code, {
      lang,
    });
  } else {
    const highlightLines = rangeParser(highlightMeta[1]);

    html = shikiHighlighter.codeToHtml(code, {
      lang,
      lineOptions: highlightLines.map((element) => ({
        line: element,
        classes: ['highlight-line'],
      })),
    });
  }
  html = makeFocussable(html);
  return escapeHtml(html);
}

export default highlighter;

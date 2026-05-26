// Site-chrome override for landing pages.
//
// The public route at app/lp/[slug]/route.ts proxies third-party HTML out of
// Supabase Storage. When `use_site_chrome` is on for a row (or lazily flipped
// on via the revert deadline), we best-effort strip the partner's header and
// footer and inject the LumZen chrome instead.
//
// Detection is heuristic; the chrome is always injected when the toggle is on,
// even if no partner header/footer could be located. The admin preflight
// surfaces detection results so an editor can spot a partner page where this
// trick wouldn't fully replace the existing chrome.

import { parse, type HTMLElement } from "node-html-parser";

import { getSiteChromeHtml } from "./site-chrome-html";
import { type Locale } from "./i18n/config";

export type ChromeRow = {
  use_site_chrome: boolean;
  chrome_revert_to: boolean | null;
  chrome_revert_at: string | null;
};

export type EffectiveChromeState = {
  effective: boolean;
  pendingRevertAt: Date | null;
  pendingRevertTo: boolean | null;
};

export function effectiveChromeState(
  row: ChromeRow,
  now: Date = new Date(),
): EffectiveChromeState {
  if (row.chrome_revert_at && row.chrome_revert_to !== null) {
    const deadline = new Date(row.chrome_revert_at);
    if (Number.isFinite(deadline.getTime())) {
      if (deadline.getTime() <= now.getTime()) {
        return {
          effective: row.chrome_revert_to,
          pendingRevertAt: null,
          pendingRevertTo: null,
        };
      }
      return {
        effective: row.use_site_chrome,
        pendingRevertAt: deadline,
        pendingRevertTo: row.chrome_revert_to,
      };
    }
  }
  return {
    effective: row.use_site_chrome,
    pendingRevertAt: null,
    pendingRevertTo: null,
  };
}

const HEADER_ID_RE = /^(header|site-header|navbar|nav|topbar|masthead|main-nav)$/i;
const HEADER_CLASS_RE = /(header|navbar|topbar|masthead|site-nav)/i;
const FOOTER_ID_RE = /^(footer|site-footer|page-footer|bottom)$/i;
const FOOTER_CLASS_RE = /(footer|site-footer|page-footer)/i;

function parseDoc(html: string): HTMLElement {
  return parse(html, {
    lowerCaseTagName: false,
    comment: false,
  });
}

function findFirstByIdRegex(root: HTMLElement, re: RegExp): HTMLElement | null {
  for (const node of root.querySelectorAll("[id]")) {
    const id = node.getAttribute("id");
    if (id && re.test(id)) return node;
  }
  return null;
}

function findFirstByClassRegex(root: HTMLElement, re: RegExp): HTMLElement | null {
  for (const node of root.querySelectorAll("[class]")) {
    const cls = node.getAttribute("class");
    if (cls && re.test(cls)) return node;
  }
  return null;
}

function findHeaderNode(root: HTMLElement): HTMLElement | null {
  const semantic = root.querySelector("header");
  if (semantic) return semantic;

  const byId = findFirstByIdRegex(root, HEADER_ID_RE);
  if (byId) return byId;

  const byClass = findFirstByClassRegex(root, HEADER_CLASS_RE);
  if (byClass) return byClass;

  const body = root.querySelector("body");
  if (body) {
    for (const child of body.childNodes) {
      const el = child as HTMLElement;
      if (el && typeof el.tagName === "string" && el.tagName.toLowerCase() === "nav") {
        return el;
      }
    }
  }
  return null;
}

function findFooterNode(root: HTMLElement): HTMLElement | null {
  const semantic = root.querySelector("footer");
  if (semantic) return semantic;

  const byId = findFirstByIdRegex(root, FOOTER_ID_RE);
  if (byId) return byId;

  const byClass = findFirstByClassRegex(root, FOOTER_CLASS_RE);
  if (byClass) return byClass;

  return null;
}

export function detectChrome(html: string): {
  headerFound: boolean;
  footerFound: boolean;
} {
  const root = parseDoc(html);
  return {
    headerFound: findHeaderNode(root) !== null,
    footerFound: findFooterNode(root) !== null,
  };
}

function insertAfterOpenTag(html: string, tag: "head" | "body", payload: string): string {
  const re = new RegExp(`<${tag}\\b[^>]*>`, "i");
  const match = html.match(re);
  if (!match || match.index === undefined) return html;
  const at = match.index + match[0].length;
  return html.substring(0, at) + payload + html.substring(at);
}

function insertBeforeCloseTag(html: string, tag: "body", payload: string): string {
  const re = new RegExp(`<\\/${tag}\\s*>`, "i");
  const match = html.match(re);
  if (!match || match.index === undefined) return html + payload;
  const at = match.index;
  return html.substring(0, at) + payload + html.substring(at);
}

export function applyChromeSwap(
  html: string,
  locale?: Locale,
): { html: string; headerFound: boolean; footerFound: boolean } {
  const root = parseDoc(html);

  const headerNode = findHeaderNode(root);
  const footerNode = findFooterNode(root);

  if (headerNode) headerNode.remove();
  if (footerNode) footerNode.remove();

  let stripped = root.toString();

  const { css, headerHtml, footerHtml } = getSiteChromeHtml(locale);
  const styleTag = `<style data-lz-chrome="style">${css}</style>`;

  stripped = insertAfterOpenTag(stripped, "head", styleTag);
  stripped = insertAfterOpenTag(stripped, "body", headerHtml);
  stripped = insertBeforeCloseTag(stripped, "body", footerHtml);

  return {
    html: stripped,
    headerFound: headerNode !== null,
    footerFound: footerNode !== null,
  };
}

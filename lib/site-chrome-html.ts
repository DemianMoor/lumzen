// Keep visually in sync with components/site-nav.tsx — this is a hand-maintained
// copy. Partner landing pages don't load Tailwind or LumZen's font CSS variables,
// so the chrome ships as plain HTML + scoped CSS prefixed with `lz-chrome-`.
//
// All hrefs are site-root-relative so they continue to land on the production
// LumZen domain when injected over a partner page served from /lp/<slug>.

import { type Locale, DEFAULT_LOCALE } from "./i18n/config";
import { getMessages, t, type Messages } from "./i18n/server";

const SITE_CHROME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.lz-chrome-header,
.lz-chrome-footer,
.lz-chrome-header *,
.lz-chrome-footer * {
  box-sizing: border-box;
}

.lz-chrome-header {
  position: sticky;
  top: 0;
  z-index: 2147483600;
  width: 100%;
  background: rgba(6, 6, 15, 0.92);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(196, 163, 90, 0.12);
  font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #f0eff8;
}

.lz-chrome-header-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.lz-chrome-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #f0eff8;
  flex-shrink: 0;
}
.lz-chrome-brand-mark {
  font-size: 20px;
  line-height: 1;
  color: #c4a35a;
}
.lz-chrome-brand-name {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  letter-spacing: 0.14em;
  color: #f0eff8;
  transition: color 0.15s ease;
}
.lz-chrome-brand:hover .lz-chrome-brand-name {
  color: #c4a35a;
}

.lz-chrome-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.lz-chrome-nav-link {
  font-size: 15px;
  color: #8f8daa;
  text-decoration: none;
  transition: color 0.15s ease;
}
.lz-chrome-nav-link:hover {
  color: #f0eff8;
}

.lz-chrome-btn {
  display: inline-block;
  font-size: 15px;
  text-decoration: none;
  border-radius: 9999px;
  padding: 10px 20px;
  transition: filter 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.lz-chrome-btn-primary {
  background: #c4a35a;
  color: #06060f;
  font-weight: 500;
}
.lz-chrome-btn-primary:hover {
  filter: brightness(1.1);
}
.lz-chrome-btn-ghost {
  color: #8f8daa;
  padding: 10px 0;
}
.lz-chrome-btn-ghost:hover {
  color: #f0eff8;
}

@media (max-width: 720px) {
  .lz-chrome-header-inner {
    padding: 14px 18px;
    gap: 12px;
  }
  .lz-chrome-brand-name {
    font-size: 15px;
  }
  .lz-chrome-nav-link,
  .lz-chrome-btn-ghost {
    display: none;
  }
  .lz-chrome-nav {
    gap: 0;
  }
  .lz-chrome-btn-primary {
    padding: 8px 16px;
    font-size: 14px;
  }
}

.lz-chrome-footer {
  position: relative;
  z-index: 10;
  background: #06060f;
  border-top: 1px solid rgba(196, 163, 90, 0.10);
  font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #8f8daa;
}
.lz-chrome-footer-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 56px 24px;
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .lz-chrome-footer-inner {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.lz-chrome-footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.lz-chrome-footer-brand-mark {
  color: #c4a35a;
  font-size: 20px;
  line-height: 1;
}
.lz-chrome-footer-brand-name {
  font-family: 'Cinzel', serif;
  font-size: 17px;
  letter-spacing: 0.14em;
  color: #f0eff8;
}
.lz-chrome-footer-tagline {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-size: 16px;
  line-height: 1.6;
  color: #8f8daa;
  margin: 0;
}
.lz-chrome-footer-description {
  font-size: 12px;
  line-height: 1.65;
  color: #8f8daa;
  margin: 16px 0 0 0;
  max-width: 22em;
}

.lz-chrome-footer-heading {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c4a35a;
  margin: 0 0 16px 0;
}

.lz-chrome-footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lz-chrome-footer-link {
  font-size: 14px;
  color: #8f8daa;
  text-decoration: none;
  transition: color 0.15s ease;
}
.lz-chrome-footer-link:hover {
  color: #f0eff8;
}

.lz-chrome-footer-base {
  border-top: 1px solid rgba(196, 163, 90, 0.08);
}
.lz-chrome-footer-base-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
@media (min-width: 640px) {
  .lz-chrome-footer-base-inner {
    flex-direction: row;
    align-items: center;
  }
}
.lz-chrome-footer-copy {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  color: #4a4866;
  margin: 0;
}
`.trim();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHeader(messages: Messages): string {
  const linkAbout = escapeHtml(t(messages, "nav.header.link.about"));
  const linkSubscribe = escapeHtml(t(messages, "nav.header.link.subscribe"));
  const linkContact = escapeHtml(t(messages, "nav.header.link.contact"));
  const labelSignin = escapeHtml(t(messages, "nav.header.signin"));
  const labelSignup = escapeHtml(t(messages, "nav.header.signup"));

  return `<header class="lz-chrome-header" data-lz-chrome="header">
  <div class="lz-chrome-header-inner">
    <a class="lz-chrome-brand" href="/">
      <span class="lz-chrome-brand-mark" aria-hidden="true">✦</span>
      <span class="lz-chrome-brand-name">LumZen</span>
    </a>
    <nav class="lz-chrome-nav" aria-label="LumZen">
      <a class="lz-chrome-nav-link" href="/about">${linkAbout}</a>
      <a class="lz-chrome-nav-link" href="/subscribe">${linkSubscribe}</a>
      <a class="lz-chrome-nav-link" href="/contact">${linkContact}</a>
      <a class="lz-chrome-btn lz-chrome-btn-ghost" href="/auth/signin">${labelSignin}</a>
      <a class="lz-chrome-btn lz-chrome-btn-primary" href="/auth/signup">${labelSignup}</a>
    </nav>
  </div>
</header>`;
}

function renderFooter(messages: Messages): string {
  const tagline = escapeHtml(t(messages, "footer.tagline"));
  const description = escapeHtml(t(messages, "footer.description"));
  const sanctuaryHeading = escapeHtml(t(messages, "footer.sanctuary_heading"));
  const sanctuaryAbout = escapeHtml(t(messages, "footer.sanctuary.about"));
  const sanctuarySubscribe = escapeHtml(t(messages, "footer.sanctuary.subscribe"));
  const sanctuaryContact = escapeHtml(t(messages, "footer.sanctuary.contact"));
  const sanctuarySignin = escapeHtml(t(messages, "footer.sanctuary.signin"));
  const finePrintHeading = escapeHtml(t(messages, "footer.fine_print_heading"));
  const finePrintPrivacy = escapeHtml(t(messages, "footer.fine_print.privacy"));
  const finePrintTerms = escapeHtml(t(messages, "footer.fine_print.terms"));
  const year = String(new Date().getFullYear());
  const copyright = escapeHtml(t(messages, "footer.copyright", { year }));
  const disclaimer = escapeHtml(t(messages, "footer.disclaimer"));

  return `<footer class="lz-chrome-footer" data-lz-chrome="footer">
  <div class="lz-chrome-footer-inner">
    <div>
      <div class="lz-chrome-footer-brand">
        <span class="lz-chrome-footer-brand-mark" aria-hidden="true">✦</span>
        <span class="lz-chrome-footer-brand-name">LumZen</span>
      </div>
      <p class="lz-chrome-footer-tagline">${tagline}</p>
      <p class="lz-chrome-footer-description">${description}</p>
    </div>
    <div>
      <p class="lz-chrome-footer-heading">${sanctuaryHeading}</p>
      <ul class="lz-chrome-footer-list">
        <li><a class="lz-chrome-footer-link" href="/about">${sanctuaryAbout}</a></li>
        <li><a class="lz-chrome-footer-link" href="/subscribe">${sanctuarySubscribe}</a></li>
        <li><a class="lz-chrome-footer-link" href="/contact">${sanctuaryContact}</a></li>
        <li><a class="lz-chrome-footer-link" href="/auth/signin">${sanctuarySignin}</a></li>
      </ul>
    </div>
    <div>
      <p class="lz-chrome-footer-heading">${finePrintHeading}</p>
      <ul class="lz-chrome-footer-list">
        <li><a class="lz-chrome-footer-link" href="/privacy">${finePrintPrivacy}</a></li>
        <li><a class="lz-chrome-footer-link" href="/terms">${finePrintTerms}</a></li>
        <li><a class="lz-chrome-footer-link" href="mailto:hello@lumzen.co">hello@lumzen.co</a></li>
        <li><a class="lz-chrome-footer-link" href="tel:+15407397462">+1 (540) 739-7462</a></li>
      </ul>
    </div>
  </div>
  <div class="lz-chrome-footer-base">
    <div class="lz-chrome-footer-base-inner">
      <p class="lz-chrome-footer-copy">${copyright}</p>
      <p class="lz-chrome-footer-copy">${disclaimer}</p>
    </div>
  </div>
</footer>`;
}

export type SiteChromeHtml = {
  css: string;
  headerHtml: string;
  footerHtml: string;
};

export function getSiteChromeHtml(locale: Locale = DEFAULT_LOCALE): SiteChromeHtml {
  const messages = getMessages(locale);
  return {
    css: SITE_CHROME_CSS,
    headerHtml: renderHeader(messages),
    footerHtml: renderFooter(messages),
  };
}

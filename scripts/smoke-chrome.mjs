// Synthetic smoke tests for lib/landing-page-chrome.ts detection rules.
// Run with: node scripts/smoke-chrome.mjs
// Uses Node 22+'s built-in TypeScript type-stripping (--experimental-strip-types
// is on by default in Node 23+; Node 24 supports it without a flag).

import { applyChromeSwap, detectChrome } from "../lib/landing-page-chrome.ts";

function assert(name, cond) {
  if (!cond) {
    console.error("FAIL", name);
    process.exitCode = 1;
  } else {
    console.log(" ok ", name);
  }
}

const fixtures = [
  {
    name: "semantic header + footer",
    html: `<!doctype html><html><head><title>p</title></head><body><header>OLD H</header><main>x</main><footer>OLD F</footer></body></html>`,
    expect: { headerFound: true, footerFound: true },
  },
  {
    name: "class navbar + page-footer",
    html: `<!doctype html><html><head></head><body><div class="topbar navbar dark">OLD H</div><main>x</main><div class="page-footer">OLD F</div></body></html>`,
    expect: { headerFound: true, footerFound: true },
  },
  {
    name: "id case-mixed",
    html: `<!doctype html><html><head></head><body><div id="Site-Header">OLD H</div><main>x</main><div id="Footer">OLD F</div></body></html>`,
    expect: { headerFound: true, footerFound: true },
  },
  {
    name: "first <nav> direct child of body, no footer",
    html: `<!doctype html><html><head></head><body><nav>OLD NAV</nav><main>x</main></body></html>`,
    expect: { headerFound: true, footerFound: false },
  },
  {
    name: "no chrome at all",
    html: `<!doctype html><html><head></head><body><main>x</main></body></html>`,
    expect: { headerFound: false, footerFound: false },
  },
];

for (const f of fixtures) {
  const det = detectChrome(f.html);
  assert(
    `${f.name} — detectChrome.header`,
    det.headerFound === f.expect.headerFound,
  );
  assert(
    `${f.name} — detectChrome.footer`,
    det.footerFound === f.expect.footerFound,
  );

  const swap = applyChromeSwap(f.html, "en");
  assert(
    `${f.name} — swap.headerFound matches`,
    swap.headerFound === f.expect.headerFound,
  );
  assert(
    `${f.name} — swap.footerFound matches`,
    swap.footerFound === f.expect.footerFound,
  );
  assert(
    `${f.name} — site header injected`,
    swap.html.includes('data-lz-chrome="header"'),
  );
  assert(
    `${f.name} — site footer injected`,
    swap.html.includes('data-lz-chrome="footer"'),
  );
  assert(
    `${f.name} — scoped style injected`,
    swap.html.includes('data-lz-chrome="style"'),
  );
  if (f.expect.headerFound) {
    assert(
      `${f.name} — OLD H removed`,
      !swap.html.includes("OLD H") && !swap.html.includes("OLD NAV"),
    );
  }
  if (f.expect.footerFound) {
    assert(`${f.name} — OLD F removed`, !swap.html.includes("OLD F"));
  }
}

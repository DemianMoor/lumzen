/**
 * Serve-time injection of this brand's Keitaro visit script into landing-page HTML.
 *
 * Landing pages carry the partner's Keitaro *click* URLs (the CTA anchors), but
 * nothing that registers the *visit* itself — so an LP that is never clicked
 * through leaves no trace in Keitaro. This injects the brand's stored tracking
 * script so every /lp/[slug] load registers a visit.
 *
 * Fires UNCONDITIONALLY on every landing-page load: every visitor registers a
 * visit regardless of which URL or params they arrive with. (The site-wide
 * direct-capture path gates on sub_id_5 presence; landing pages do not, because
 * paid traffic lands here first and the visit is the thing being measured.)
 *
 * Any sub_ids on the URL (sub_id3 / sub_id_3, etc.) are captured by the stored
 * script itself — k.min.js reads window.location.search, so passthrough needs no
 * code here. Only sub_id_4 is set explicitly, below.
 *
 * The stored script is an HTML `<script>…</script>` block. Assigning it via
 * innerHTML would NOT execute it, so it is parked in an inert `<template>` (whose
 * scripts do not run on parse) and a small bootstrap recreates each `<script>` as
 * a live DOM node so the browser runs it. This handles both inline scripts and
 * `<script src>` tags. Everything is wrapped in try/catch so a malformed stored
 * value can never break the page.
 *
 * The script's own URLs (R_PATH, P_PATH, the k.min.js src, the <noscript> pixel)
 * are left exactly as stored. lib/tracking-rewrite points them at this brand's
 * tracking domain in the same pass that rewrites the stored CTA anchors, which is
 * why the caller must run the rewriter AFTER this injector — see the chain-order
 * note in app/lp/[slug]/route.ts.
 */

/**
 * Adds the page slug to the Keitaro click as sub_id_4, a click-only reporting
 * dimension. Keyed off the click token via KTracking.update, so it never touches
 * the URL and never round-trips to the affiliate (unlike sub_id_3, which the
 * query-forwarder sends downstream). The ready() callback is queued before the
 * async k.min.js initialises, so it fires once the token exists.
 */
const BOOTSTRAP =
  `<script>(function(){try{` +
  `var t=document.getElementById('keitaro-direct');if(!t)return;` +
  `var ss=t.content.querySelectorAll('script');` +
  `for(var i=0;i<ss.length;i++){var o=ss[i],n=document.createElement('script');` +
  `for(var j=0;j<o.attributes.length;j++){n.setAttribute(o.attributes[j].name,o.attributes[j].value);}` +
  `if(o.src){n.src=o.src;}else{n.textContent=o.textContent;}document.head.appendChild(n);}` +
  `var p=window.location.pathname,slug;` +
  `if(p.indexOf('/lp/')===0){slug=p.slice(4).split('/')[0];}` +
  `else{var sg=p.split('/').filter(Boolean);slug=sg[sg.length-1]||'';}` +
  `if(slug&&window.KTracking&&window.KTracking.ready){` +
  `window.KTracking.ready(function(){try{window.KTracking.update({sub_id_4:slug});}catch(e){}});}` +
  `}catch(e){}})();</script>`;

/**
 * Inserts the script block immediately after `<head>`, alongside the GTM head
 * script. Both are async and order-independent, so they stack without collision.
 * A document with no `<head>` is returned unchanged rather than guessed at.
 */
export function injectKeitaro(html: string, keitaroScript: string): string {
  if (!keitaroScript) return html;

  const block = `<template id="keitaro-direct">${keitaroScript}</template>${BOOTSTRAP}`;

  const headMatch = html.match(/<head[^>]*>/i);
  if (!headMatch) return html;

  const at = headMatch.index! + headMatch[0].length;
  return html.substring(0, at) + block + html.substring(at);
}

# SMS Compliance — production `legal_pages` DB changes (HOLD for approval)

The English Terms and Privacy pages render from the Supabase `legal_pages`
table (project `lumzen`, ref `bgqyxamayxqnmowugqsd`), **not** from the repo
JSX/i18n files. The repo changes in this branch update the uk/ru + fallback
copy; the English pages that SimpleTexting reviews only change when the two
SQL statements below are applied.

**Do not run these until the PR is approved.** They are idempotent (guarded so
a second run is a no-op) and change content only — no schema/DDL.

`support@lumzen.co` must exist as a reachable inbox/alias before the SMS
program goes live — it is the HELP/support contact in the new copy.

---

## 1. Terms — insert "8A) Agreement to Receive Text Messages" before section 9

```sql
update legal_pages
set body = replace(
  body,
  '<h2>9) Third-Party Services and Links</h2>',
  '<h2>8A) Agreement to Receive Text Messages</h2>'
  || '<p>When you opt in to the LumZen text-messaging program — for example, by checking the SMS consent box on lumzen.co and providing your mobile number — you agree to receive recurring automated promotional and content-update text messages (such as new meditations, affirmations, and special offers) from LumZen at the mobile number you provide. Consent to receive text messages is not a condition of any purchase or of using any LumZen service.</p>'
  || '<p><strong>Message frequency:</strong> up to 4 messages per month. Message and data rates may apply.</p>'
  || '<p><strong>Opting out (STOP):</strong> You can cancel the program at any time by texting STOP to our SMS number. After you send STOP, we will send you a one-time message to confirm that you have been unsubscribed, after which you will no longer receive text messages from the program. If you would like to rejoin, sign up again as you did the first time.</p>'
  || '<p><strong>Getting help (HELP):</strong> If you are experiencing any issues with the messaging program, reply with the keyword HELP or contact us at <a href="mailto:support@lumzen.co">support@lumzen.co</a>.</p>'
  || '<p><strong>Supported carriers:</strong> The program is available on major U.S. wireless carriers, including (but not limited to) AT&amp;T, Verizon Wireless, T-Mobile, US Cellular, and their affiliates and resellers. Carrier participation may change without notice.</p>'
  || '<p><strong>Carrier liability:</strong> Carriers are not liable for delayed or undelivered messages. T-Mobile is not liable for delayed or undelivered messages.</p>'
  || '<p><strong>If your mobile number changes:</strong> If you change or deactivate the mobile number you provided, you agree to promptly notify us by texting STOP from that number or by emailing <a href="mailto:support@lumzen.co">support@lumzen.co</a>, so that we do not send messages to a person who is not the intended recipient.</p>'
  || '<p><strong>Information we collect through the program:</strong> To operate the program we collect and process your mobile number, your opt-in and opt-out records, and message-delivery data (such as timestamps and delivery status). We use this information only to send the messages you requested and to operate, secure, and support the program. No mobile information will be sold or shared with third parties or affiliates for marketing or promotional purposes, and text-messaging originator opt-in data and consent will not be shared with any third parties. See our <a href="/privacy">Privacy Policy</a> for details.</p>'
  || '<p><strong>Changes to or termination of the program:</strong> We may change, suspend, or terminate the program, or update these SMS terms, at any time with or without notice. Your continued participation after changes are posted on lumzen.co constitutes your acceptance of the updated terms.</p>'
  || '<h3>Will I be charged for the text messages I receive?</h3>'
  || '<p>LumZen does not charge for the text messages you receive through the program. However, message and data rates may apply depending on your wireless plan, and you are responsible for any such charges from your carrier. If you have questions about your plan, contact your wireless provider.</p>'
  || '<h2>9) Third-Party Services and Links</h2>'
),
updated_at = now()
where slug = 'terms' and locale = 'en'
  and body not ilike '%Agreement to Receive Text Messages%';
```

> TODO: replace "our SMS number" (2 places above) with the SimpleTexting-assigned
> number once provisioned.

---

## 2. Privacy — align frequency, swap SMS HELP contact, insert verbatim block

```sql
update legal_pages
set body = replace(
    replace(
      replace(
        body,
        '(up to a few messages per week)',
        '(up to 4 messages per month)'
      ),
      'Help: Reply HELP for help, or contact privacy@lumzen.co',
      'Help: Reply HELP for help, or contact support@lumzen.co'
    ),
    '<h3>B. Who we do share SMS data with (limited)</h3>',
    '<p>No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</p>'
    || '<h3>B. Who we do share SMS data with (limited)</h3>'
),
updated_at = now()
where slug = 'privacy' and locale = 'en'
  and body not ilike '%third parties/affiliates for marketing/promotional purposes%';
```

The verbatim sentence is inserted exactly as required by the SimpleTexting
Privacy template.

---

## Verify after applying

```sql
select slug,
  body ilike '%Agreement to Receive Text Messages%' as terms_ok,
  body ilike '%T-Mobile is not liable%'             as tmobile_ok,
  body ilike '%Will I be charged%'                  as faq_ok,
  body ilike '%third parties/affiliates for marketing/promotional purposes%' as verbatim_ok,
  body ilike '%support@lumzen.co%'                  as support_ok
from legal_pages where locale = 'en' order by slug;
```

## Note — "Last Updated" date

Both DB bodies and `lib/legal/constants.ts` (`LEGAL_LAST_UPDATED`) currently
read **April 18, 2026**. Bumping this on a material legal change is good
practice but is a business decision — left unchanged here. Say the word and I
will bump it in the same pass (repo constant + a `replace()` on both bodies).

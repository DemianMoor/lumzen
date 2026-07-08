-- 0012_subscribers_terms_consent.sql
-- Records explicit acceptance of the Terms of Service & Privacy Policy at
-- subscribe time. Mirrors the existing consent_email / consent_sms boolean +
-- *_consent_at timestamp pairs so the audit trail is uniform.

alter table public.subscribers
  add column if not exists terms_consent boolean not null default false;

alter table public.subscribers
  add column if not exists terms_consent_at timestamptz;

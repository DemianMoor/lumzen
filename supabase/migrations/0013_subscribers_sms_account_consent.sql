-- 0013_subscribers_sms_account_consent.sql
-- Separate opt-in for account / customer-service (transactional) SMS,
-- distinct from the marketing SMS consent (consent_sms / sms_consent_at).
-- Mirrors the existing consent boolean + *_consent_at timestamp pairs.

alter table public.subscribers
  add column if not exists sms_account_consent boolean not null default false;

alter table public.subscribers
  add column if not exists sms_account_consent_at timestamptz;

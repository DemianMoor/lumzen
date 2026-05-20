/**
 * Legal page constants. Update on every revision of Privacy, Terms,
 * or SMS Terms — the dates and corporate identifiers below are read
 * by every legal surface in the site.
 *
 * The placeholders that are not yet finalized (province of
 * registration, registered postal address, SMS provider) ship as
 * bracketed strings; replace them before the public launch.
 */

export const LEGAL_EFFECTIVE_DATE = "May 18, 2026";
export const LEGAL_LAST_UPDATED = "April 18, 2026";

export const LEGAL_OPERATOR = {
  brand: "LumZen",
  legalEntity: "DemianSpirits",
  operatingCountry: "Canada",
  serviceRegion: "United States only",
  province: "Ontario", // pending confirmation
  postalAddress: "[Canadian postal address — pending]",
  websiteHost: "Vercel (United States)",
  database: "Supabase (United States)",
  aiProvider: "Anthropic (United States)",
  emailProvider: "Resend (United States)",
  smsProvider: "Twilio (United States)", // pending final selection
} as const;

export const LEGAL_CONTACTS = {
  privacy: "privacy@lumzen.co",
  general: "hello@lumzen.co",
  phone: "+1 (540) 739-7462",
  phoneHref: "tel:+15407397462",
} as const;

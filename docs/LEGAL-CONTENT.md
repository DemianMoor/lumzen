# LumZen — Legal Pages & Opt-In Copy
## Privacy Policy, Terms of Service, SMS Terms, Subscribe Forms

> **Build target:** A complete set of legal/compliance pages and consent copy for LumZen, the spiritual practice platform operated by **DemianSpirits** (Canadian company) targeting **US-based subscribers only**.
>
> **Compliance scope:**
> - US Federal: **TCPA** (SMS), **CAN-SPAM** (email), **COPPA** (under-13 protection)
> - US State: **CCPA/CPRA** (California), Virginia, Colorado, Connecticut, Utah, Oregon, Texas comprehensive privacy laws
> - Cross-border: Canadian operator handling US user data (disclosure-only; PIPEDA does not extend to US residents but transparency is good practice)
> - Carrier requirements: T-Mobile, AT&T, Verizon, US Cellular SMS Code of Conduct
>
> **NOT a substitute for legal review.** This content is built from regulatory best practice and the GuideKin reference (which was lawyer-reviewed). Before going live, have a US-licensed attorney experienced in TCPA and state privacy law review every word. The 30-day window before launch is a good time to do this.

---

## TABLE OF CONTENTS

1. [Privacy Policy](#1-privacy-policy)
2. [Terms of Service](#2-terms-of-service)
3. [SMS Terms & Conditions](#3-sms-terms--conditions)
4. [Subscribe Page Opt-In Copy](#4-subscribe-page-opt-in-copy)
5. [Subscribe Popup Opt-In Copy](#5-subscribe-popup-opt-in-copy)
6. [Footer Disclosure Links](#6-footer-disclosure-links)
7. [Welcome Email Body (TCPA Confirmation)](#7-welcome-email-body)
8. [Claude Code Build Instructions](#8-claude-code-build-instructions)

---

## 1. PRIVACY POLICY

**File path:** `app/privacy/page.tsx`
**Route:** `https://lumzen.co/privacy`
**Layout:** Public marketing layout (cosmic background, no sidebar)
**Typography:** Cormorant headings, Jost body, max-width 720px centered, generous line-height (1.7)

---

### Page H1
**Privacy Policy**

### Eyebrow above H1
`✦ LEGAL`

### Subhead under H1
*How LumZen collects, uses, and protects your information.*

### Effective Date line
**Effective Date:** [INSERT LAUNCH DATE — formatted as: Month DD, YYYY]
**Last Updated:** [INSERT LAUNCH DATE]

---

### Introduction

This Privacy Policy explains how **DemianSpirits**, a Canadian company operating as **LumZen** ("LumZen," "we," "us," or "our"), collects, uses, and discloses personal information when you visit lumzen.co (the "Site"), create a LumZen account, or subscribe to receive email or text (SMS) communications from us (collectively, the "Services").

LumZen offers spiritual practice tools — including tarot readings, natal chart generation, guided affirmations, meditation audio, and educational content — provided free of charge and supported by advertising.

The Services are intended for residents of the **United States only**. By using the Services, you confirm that you are located in the United States and are at least 18 years of age.

If you do not agree with this Privacy Policy, please do not use the Services or provide personal information to us.

---

### 1) Who We Are / Contact

- **Brand:** LumZen
- **Website:** lumzen.co
- **Legal Entity:** DemianSpirits (a Canadian company)
- **Operating Location:** Canada
- **Service Region:** United States only
- **Email:** privacy@lumzen.co
- **General contact:** hello@lumzen.co

Because LumZen is operated from Canada, personal information you provide will be transferred to, processed, and stored in Canada and may also be processed in the United States by our service providers. Canada is a jurisdiction with comprehensive privacy laws (PIPEDA), and we apply equivalent safeguards regardless of where data is processed.

---

### 2) What This Policy Covers (and What It Doesn't)

This Privacy Policy applies to information we collect through the Services.

It does **not** apply to:

- Third-party websites, apps, or services we link to
- Third-party advertising networks and the data they collect through ad placements on our Site (see Section 9)
- Third-party authentication providers if you sign in via a third party (currently we offer email + password only)

We encourage you to review the privacy policies of any third parties you interact with.

---

### 3) Personal Information We May Collect

"Personal information" means information that identifies you or reasonably relates to an identifiable individual.

#### A. Information you provide

We may collect:

- **Identifiers and contact information** — name, email address, mobile number, ZIP code
- **Account information** — display name, profile preferences, password (stored as a hash, never in plain text)
- **Spiritual practice data** — birth date, birth time, and birth city (for natal chart generation), tarot reading history, affirmation activity, listening history, journal entries you choose to save
- **Message content you submit** — inquiries, customer support requests, SMS replies
- **Preferences** — practice focus areas, intention selections, time-of-day preferences

You choose what to share. Most LumZen features work with just an email and password.

> **Important about birth data.** Your birth date, time, and city are used only to generate your natal chart and may be sent to our AI service provider (see Section 6) to produce a personalized interpretation. Birth data is stored encrypted at rest in our database and is never sold or shared for marketing purposes.

#### B. Information collected automatically

When you use the Site, we may collect:

- **Device and browser information** — IP address, device type, browser type, operating system, screen size
- **Usage data** — pages viewed, features used, links clicked, time spent, referring URLs, audio tracks played
- **Approximate location** derived from IP address (city or state level only — we do not collect precise GPS location)

#### C. Cookies and similar technologies

We may use cookies, pixels, tags, SDKs, and similar technologies for:

- Site functionality and security (essential cookies)
- Authentication and session management
- Analytics — understanding how the Site is used
- Remembering your preferences
- Measuring email and SMS engagement (e.g., open and click rates)
- Serving and measuring advertisements (see Section 9)

You can control cookies via your browser settings. If you disable essential cookies, the Services may not function. For information about your choices regarding interest-based advertising, you may visit the Digital Advertising Alliance at **optout.aboutads.info** or the Network Advertising Initiative at **optout.networkadvertising.org**.

---

### 4) How We Collect Personal Information

We may collect personal information:

- When you create an account, fill out a form, subscribe, or otherwise interact with the Site
- When you opt in to receive SMS or email communications
- When you generate a natal chart or save a tarot reading
- When you contact us for support
- Automatically via cookies, server logs, and similar technologies
- From advertising and analytics partners who share aggregated audience information with us

If you provide information about another person (for example, a family member's birth chart you generate), you represent that you have the authority to do so.

---

### 5) How We Use Personal Information

We may use personal information to:

- Provide, operate, maintain, and improve the Services
- Generate your natal chart, daily tarot card, personalized affirmations, and other practice features
- Send you requested communications, including newsletters, content updates, feature announcements, and promotional messages
- Administer and support our SMS and email programs (see Sections 7 and 8)
- Personalize content and recommendations based on your preferences and engagement
- Display and measure advertisements that support our free service (see Section 9)
- Respond to questions, requests, or customer support issues
- Monitor, prevent, and investigate fraud, abuse, security incidents, and policy violations
- Comply with legal obligations and enforce our terms and policies

---

### 6) How We Disclose Personal Information

#### A. We do not sell your personal information

LumZen does not sell your personal information for money. We also do not "share" your personal information for cross-context behavioral advertising as those terms are defined under California law, **except** as you may consent through advertising cookie choices managed via your browser or via the Digital Advertising Alliance opt-out tools.

#### B. Service providers (processors)

We disclose personal information to vendors that perform services for us. These parties may use personal information only to provide services to us, under contractual protections. Categories include:

- **Website hosting and infrastructure** — Vercel (United States)
- **Database and authentication** — Supabase (United States)
- **AI interpretation services** — Anthropic (United States), used to generate natal chart readings, tarot interpretations, and personalized affirmations. When you request these features, the relevant input (birth data, tarot card draw, your question) is sent to Anthropic for processing. Anthropic does not store conversational content for training under their standard API terms.
- **Email service** — Resend (United States), for transactional and marketing emails
- **SMS delivery** — [SMS provider TBD before launch — likely Twilio]
- **Analytics** — Google Analytics, Microsoft Clarity, and similar measurement services
- **Advertising** — ad networks and ad measurement partners (see Section 9)
- **Audio content delivery** — Freesound (Creative Commons audio streaming), LibriVox (public domain audiobook streaming)
- **Astrology calculations** — open-source ephemeris libraries running on our servers; no third-party API receives your birth data for chart calculations themselves

#### C. Legal, safety, and business transfers

We may disclose information:

- To comply with law, regulation, subpoena, or lawful government request from US authorities or, in limited circumstances, Canadian authorities
- To protect the rights, safety, and security of users, our business, or others
- In connection with a merger, acquisition, financing, reorganization, or sale of assets (subject to appropriate safeguards)

#### D. De-identified or aggregated information

We may share aggregated or de-identified information that cannot reasonably identify you.

---

### 7) SMS / Text Messaging Privacy (Carrier-Friendly Disclosure)

If you choose to join our SMS program, we will use your mobile number and related data to send you text messages and to operate the program. By opting in, you provide your **prior express written consent under the Telephone Consumer Protection Act (TCPA)** to receive marketing text messages from LumZen sent using an automatic telephone dialing system or otherwise. Consent is not a condition of using any free LumZen service.

- **Program purpose:** daily practice reminders, content drops, feature announcements, and curated spiritual practice tips
- **Message frequency:** Message frequency varies (up to a few messages per week)
- **Msg & data rates may apply**
- **Opt-out:** Reply STOP at any time to cancel
- **Help:** Reply HELP for help, or contact privacy@lumzen.co
- **Carrier disclaimer:** Carriers are not liable for delayed or undelivered messages

#### A. No marketing sharing of mobile data or opt-in data

To meet wireless-carrier expectations for messaging programs, we state clearly:

- **No mobile information will be sold or shared with third parties or affiliates for marketing or promotional purposes.**
- **Text messaging originator opt-in data and consent will not be shared with any third parties.**

#### B. Who we do share SMS data with (limited)

We share the minimum necessary information with vendors that help deliver and manage messages (for example, messaging platform providers, delivery vendors, and telecom carriers). These parties may use the data only to provide services to us (delivery, compliance, support, fraud prevention).

#### C. Retention for consent and compliance

We retain records of SMS opt-in and opt-out events and message history as needed to:

- demonstrate consent,
- honor STOP requests,
- comply with legal and carrier requirements (including the TCPA), and
- prevent abuse.

---

### 8) Email Marketing Communications

If you sign up for our emails, you consent to receive marketing and promotional messages from LumZen. We comply with the federal **CAN-SPAM Act**, which means:

- Our marketing emails identify LumZen as the sender and include a valid postal address
- Subject lines accurately reflect the content of the email
- Each marketing email contains a clear unsubscribe link

You can opt out at any time by clicking the unsubscribe link in any of our marketing emails or by emailing privacy@lumzen.co with the subject line "Unsubscribe." We will honor opt-out requests promptly, and in any event within 10 business days, as required by law.

Some communications may be transactional or service-related (for example, password resets, account confirmations, security notices, or responses to your support request), and you may not be able to opt out of those while you are using the Services.

---

### 9) Advertising

LumZen is **free to use and supported by advertising**. We may display advertisements within the Services, including banner ads, in-content ad placements, and sponsored content.

#### How advertising works

- We may use third-party advertising networks and ad-tech vendors to display ads relevant to your interests.
- These partners may collect information about your activity on the Services and other sites over time using cookies, pixels, and similar technologies.
- We do not directly provide your name, email, mobile number, or birth data to advertisers.
- Some advertising on the Services may be contextual (based on the content of the page) rather than behavioral (based on your activity).

#### Your choices

- You can opt out of interest-based advertising via the **Digital Advertising Alliance** (optout.aboutads.info) or the **Network Advertising Initiative** (optout.networkadvertising.org).
- For mobile devices, you can use your device's "Limit Ad Tracking" or equivalent setting.
- Where required by law, we honor opt-out preference signals such as the **Global Privacy Control (GPC)**.

#### Not used for advertising

The following data is **never** used for advertising purposes, including not shared with ad networks or measured against ad performance:

- Your birth date, time, or city
- Your natal chart data or interpretations
- Tarot reading content or interpretations
- Affirmation journal entries
- SMS opt-in data and consent records

---

### 10) Digital Tracking and Analytics

We may use analytics tools (such as Google Analytics, Microsoft Clarity, tag managers, and similar measurement services) to understand Site usage and improve performance. These tools may collect device and usage information, including IP address, browser type, and page interactions.

Some browsers offer a "Do Not Track" (DNT) signal. Because there is no industry-standard interpretation of DNT signals, our Site does not currently respond to DNT signals. Where required by law, we honor opt-out preference signals such as the Global Privacy Control (GPC).

---

### 11) Data Retention

We retain personal information for as long as necessary to:

- Provide the Services to you while your account is active
- Comply with our legal obligations (including TCPA, CAN-SPAM, and applicable state privacy laws)
- Resolve disputes
- Enforce our agreements

Retention periods vary based on the type of information and the purpose for which it was collected. When you delete your account, we will delete or de-identify your personal information within a reasonable timeframe, except where retention is required by law.

**Specific retention periods:**

- **Account data:** retained while your account is active and for up to 30 days after deletion, then permanently deleted
- **SMS consent records:** retained for at least 4 years after opt-out, per TCPA recordkeeping best practices
- **Email engagement data:** retained for up to 2 years
- **Tarot readings and natal charts you save:** retained while your account is active; deleted on account deletion
- **Server and security logs:** retained for up to 90 days

---

### 12) Security

We use reasonable administrative, technical, and physical safeguards designed to protect personal information, including:

- HTTPS encryption for all data in transit
- Encryption at rest for sensitive fields (birth data, journal entries)
- Industry-standard password hashing (bcrypt or equivalent)
- Role-based access controls for our team
- Regular security review of third-party service providers

However, no security system is perfect, and we cannot guarantee absolute security. You are responsible for keeping your account credentials confidential. If you believe your account has been compromised, contact us immediately at privacy@lumzen.co.

---

### 13) Persons Under 18

Our Services are intended for individuals **18 years of age or older** and located in the United States. We do not knowingly collect personal information from individuals under 18, and the Services are not directed to children under 13 within the meaning of the **Children's Online Privacy Protection Act (COPPA)**.

If you believe a minor has provided us information, contact us at privacy@lumzen.co and we will take reasonable steps to delete it.

---

### 14) U.S. State Privacy Rights

Depending on your state of residence (including, where applicable, **California, Colorado, Connecticut, Virginia, Utah, Oregon, Texas**, and other states with comprehensive privacy laws), you may have the right to:

- **Access** — request access to the personal information we hold about you
- **Delete** — request deletion of your personal information
- **Correct** — request correction of inaccurate personal information
- **Port** — request a copy of your personal information in a portable format
- **Opt out** — opt out of the sale or sharing of personal information and of certain targeted advertising or profiling, where applicable
- **Information** — receive information about our collection, use, and disclosure practices
- **Limit use of sensitive personal information** — where applicable under California law

#### California — "Shine the Light"

California Civil Code Section 1798.83 permits California residents to request information regarding the disclosure of personal information to third parties for those parties' direct marketing purposes. LumZen does not disclose personal information to third parties for their direct marketing purposes.

#### Do Not Sell or Share My Personal Information

LumZen does not sell personal information and does not share mobile opt-in data for third-party marketing (see Section 7). For interest-based advertising opt-out, see Section 9. Where required by law, we honor opt-out preference signals such as the **Global Privacy Control (GPC)**.

#### How to Submit a Request

To submit a privacy request, email **privacy@lumzen.co** with the subject line "Privacy Request." We may need to verify your identity before completing your request. You may use an authorized agent to submit a request on your behalf where state law permits; we may require proof of authorization.

- **Non-discrimination:** We will not discriminate against you for exercising your privacy rights.
- **Appeals:** If we deny your request, you may appeal our decision by replying to our denial email. Where state law provides a right to contact a state regulator if your appeal is denied, that right will be described in our response.

---

### 15) Spiritual & Wellness Content Disclaimer

LumZen provides tools and content related to spiritual practice, including tarot, astrology, affirmations, meditation, and educational guides. These offerings are **for entertainment, reflection, and personal growth purposes only**.

- LumZen is **not** a healthcare provider, mental health professional, financial advisor, or legal advisor.
- Tarot readings, natal chart interpretations, and AI-generated guidance are not predictive, diagnostic, or prescriptive.
- Content should not be used as a substitute for professional medical, mental health, financial, or legal advice.
- Always consult a qualified professional for matters affecting your health, finances, or legal situation.
- LumZen is not designed to receive or process protected health information under HIPAA. Information you submit to us is not protected by HIPAA.

If you are experiencing a mental health crisis or are in immediate danger, please contact emergency services (911 in the US), the 988 Suicide and Crisis Lifeline, or another qualified professional.

---

### 16) Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the "Effective Date" above. For material changes, we will provide additional notice (such as by email or via a prominent notice on the Site). Your continued use of the Services after the updated policy is posted means you accept the updated policy.

---

### 17) Contact Us

Questions or requests regarding privacy can be sent to:

**Email:** privacy@lumzen.co
**Subject line for privacy requests:** "Privacy Request"
**Subject line for unsubscribes:** "Unsubscribe"

---

*End of Privacy Policy*

---

## 2. TERMS OF SERVICE

**File path:** `app/terms/page.tsx`
**Route:** `https://lumzen.co/terms`
**Layout:** Public marketing layout
**Typography:** Same as Privacy Policy

---

### Page H1
**Terms of Service**

### Eyebrow above H1
`✦ LEGAL`

### Subhead under H1
*The agreement between you and LumZen.*

### Effective Date line
**Effective Date:** [INSERT LAUNCH DATE]
**Last Updated:** [INSERT LAUNCH DATE]

---

### Introduction

These Terms of Service ("Terms") form a legal agreement between you and **DemianSpirits**, a Canadian company operating as **LumZen** ("LumZen," "we," "us," or "our"), regarding your use of lumzen.co and the related services we offer (collectively, the "Services").

By creating an account or otherwise using the Services, you agree to these Terms and to our **Privacy Policy** at lumzen.co/privacy and our **SMS Terms** at lumzen.co/sms-terms (where applicable).

**Please read these Terms carefully. They include important provisions about disclaimers, limitations of liability, and how disputes are resolved.**

If you do not agree, do not use the Services.

---

### 1) Eligibility

To use the Services, you must:

- Be at least **18 years of age**
- Be **located in the United States**
- Be capable of entering into a legally binding contract
- Not be barred from using the Services under applicable law

You agree to provide accurate information when creating your account and to keep it up to date.

---

### 2) Free Service, Advertising-Supported

LumZen is **provided free of charge** and is supported by advertising. We do not currently offer paid plans. We reserve the right to introduce paid features in the future with clear notice.

You agree that LumZen may display advertisements within the Services, including banner ads, in-content placements, and sponsored content. See our Privacy Policy for how advertising data is handled.

---

### 3) Your Account

To access most LumZen features, you must create an account using a valid email address and a password.

You are responsible for:

- Maintaining the confidentiality of your password
- All activity that occurs under your account
- Notifying us immediately of any unauthorized access at privacy@lumzen.co

We may suspend or terminate your account if we believe you have violated these Terms or applicable law.

---

### 4) Permitted Use

You agree to use the Services only for lawful, personal, non-commercial purposes. You will not:

- Use the Services to violate any law or regulation
- Attempt to access another user's account or data
- Scrape, crawl, or otherwise extract data from the Services without our written permission
- Reverse engineer, decompile, or attempt to extract source code from the Services
- Interfere with or disrupt the Services (e.g., denial of service, abuse of rate limits)
- Use the Services to harass, threaten, or harm other users
- Submit content that is illegal, infringing, defamatory, obscene, or harmful
- Use the Services to provide professional advice to others (medical, legal, financial, or mental health) — the Services are for personal use only

---

### 5) Content and Intellectual Property

#### Our content

All content, design, software, branding, and original written material on the Services (other than user-submitted content and third-party licensed content) are owned by DemianSpirits or its licensors and are protected by copyright, trademark, and other intellectual property laws.

We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal, non-commercial use, in accordance with these Terms.

#### Third-party licensed content

The Services include content licensed from third parties, including:

- Tarot card imagery from the Rider-Waite-Smith deck (1909), in the public domain in the United States
- Audiobook recordings from LibriVox (public domain)
- Audio tracks from Freesound under Creative Commons licenses
- Other content as noted within the Services

This content is governed by its own license terms.

#### User-submitted content

When you submit content to the Services (for example, journal entries, saved readings, support messages, or feedback), you retain ownership of your content. You grant LumZen a worldwide, non-exclusive, royalty-free license to store, process, display, and use your content solely to provide and improve the Services to you.

You represent that any content you submit:

- Is yours to submit, or you have permission to submit it
- Does not violate the rights of any third party
- Complies with these Terms

---

### 6) AI-Generated Interpretations

LumZen uses third-party AI services (currently Anthropic's Claude) to generate personalized tarot interpretations, natal chart readings, affirmations, and other content.

You acknowledge and agree that:

- AI-generated content is produced by a machine learning model and is not the work of a human reader, astrologer, or counselor
- AI-generated interpretations are **for reflection and entertainment only** and are not predictive, diagnostic, prescriptive, or professional advice
- AI output may occasionally contain errors, inaccuracies, or content you find unhelpful
- You should not rely on AI-generated interpretations for important life decisions

---

### 7) Spiritual & Wellness Disclaimer

LumZen provides tools for spiritual practice, reflection, and personal growth. **These are not professional services.**

- LumZen is **not a healthcare provider, mental health professional, financial advisor, or legal advisor**.
- Tarot, astrology, numerology, and affirmation features are **for entertainment and personal reflection purposes only**.
- Content is not a substitute for professional medical, mental health, financial, or legal advice.
- Always consult a qualified professional for matters affecting your health, finances, or legal situation.
- LumZen is not designed to receive or process protected health information under HIPAA.

**Mental health emergencies:** If you are experiencing a mental health crisis or are in immediate danger, contact emergency services (911 in the US), the 988 Suicide and Crisis Lifeline, or another qualified professional.

---

### 8) Communications

By creating an account, you consent to receive **transactional and service-related communications** from us (for example, password resets, account confirmations, and security notices) by email. You cannot opt out of these communications while you have an active account.

You may separately opt in to receive:

- **Marketing emails** — by checking the relevant box at signup or via your account settings. You can unsubscribe at any time via the link in any marketing email.
- **SMS messages** — by checking the SMS opt-in box and providing your mobile number. SMS is governed by our **SMS Terms & Conditions** at lumzen.co/sms-terms.

See our Privacy Policy for details on how we handle communications data.

---

### 9) Third-Party Services and Links

The Services may contain links to third-party websites, services, or resources. We do not control, endorse, or assume responsibility for any third-party services. Your use of third-party services is governed by their own terms and privacy policies.

---

### 10) Disclaimers

THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, LUMZEN AND ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS, DISCLAIM ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTY THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.

WE MAKE NO REPRESENTATION OR WARRANTY THAT:

- THE SERVICES WILL MEET YOUR REQUIREMENTS
- AI-GENERATED CONTENT WILL BE ACCURATE OR USEFUL
- ASTROLOGICAL OR DIVINATORY FEATURES WILL PRODUCE ANY SPECIFIC OUTCOME
- THE SERVICES WILL ALWAYS BE AVAILABLE

---

### 11) Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY LAW, LUMZEN AND ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS, WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST DATA, OR EMOTIONAL DISTRESS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS WILL NOT EXCEED **ONE HUNDRED US DOLLARS ($100.00)** OR THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM AROSE, WHICHEVER IS GREATER. SINCE THE SERVICES ARE FREE, THE GREATER AMOUNT WILL TYPICALLY BE $100.00.

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN DAMAGES OR THE LIMITATION OF LIABILITY, SO SOME OF THESE LIMITATIONS MAY NOT APPLY TO YOU.

---

### 12) Indemnification

You agree to indemnify, defend, and hold harmless LumZen and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:

- Your use of the Services
- Your violation of these Terms
- Your violation of any law or the rights of any third party
- Content you submit to the Services

---

### 13) Termination

You may stop using the Services and delete your account at any time via your account settings or by emailing privacy@lumzen.co.

We may suspend or terminate your access to the Services at any time, with or without notice, for any reason, including if we believe you have violated these Terms.

Sections that by their nature should survive termination (including intellectual property, disclaimers, limitations of liability, indemnification, and dispute resolution) will survive.

---

### 14) Governing Law and Dispute Resolution

These Terms are governed by the laws of the **Province of [PROVINCE — TBD: typically Ontario or British Columbia], Canada**, without regard to its conflict of laws principles, and by applicable Canadian federal law.

For users located in the United States, we acknowledge that you may also have rights and protections under applicable US federal and state laws (including the TCPA and state consumer protection laws), and nothing in these Terms is intended to limit those rights.

You and LumZen agree to attempt to resolve any dispute informally by contacting us at hello@lumzen.co before initiating any formal legal proceedings. If a dispute cannot be resolved informally within 60 days, it may be brought in the courts of the Province of [PROVINCE], Canada, or in a court of competent jurisdiction in the United States, subject to applicable law.

**No class actions.** To the fullest extent permitted by law, you and LumZen each waive the right to bring or participate in any class action, collective action, or representative proceeding against the other.

---

### 15) Changes to These Terms

We may modify these Terms at any time. We will post the updated Terms on this page and update the "Effective Date" above. For material changes, we will provide additional notice (such as by email or via a prominent notice on the Site). Your continued use of the Services after the updated Terms are posted means you accept the updated Terms.

---

### 16) Miscellaneous

- **Entire agreement:** These Terms, together with the Privacy Policy and SMS Terms, constitute the entire agreement between you and LumZen regarding the Services.
- **Severability:** If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
- **No waiver:** Our failure to enforce any provision of these Terms is not a waiver of our right to do so later.
- **Assignment:** You may not assign your rights or obligations under these Terms. We may assign our rights or obligations to an affiliate or in connection with a merger, acquisition, or sale of assets.
- **Contact:** For questions about these Terms, email hello@lumzen.co.

---

*End of Terms of Service*

---

## 3. SMS TERMS & CONDITIONS

**File path:** `app/sms-terms/page.tsx`
**Route:** `https://lumzen.co/sms-terms`
**Layout:** Public marketing layout
**Typography:** Same as Privacy Policy

---

### Page H1
**SMS Terms & Conditions**

### Eyebrow above H1
`✦ LEGAL`

### Subhead under H1
*Rules for the LumZen text messaging program.*

### Effective Date line
**Effective Date:** [INSERT LAUNCH DATE]
**Last Updated:** [INSERT LAUNCH DATE]

---

### Introduction

These SMS Terms and Conditions ("SMS Terms") govern your participation in the LumZen text-messaging program (the "Program") operated by **DemianSpirits**, a Canadian company operating as **LumZen** ("LumZen," "we," "us," or "our"). The Program is offered only to individuals located in the **United States** who are **18 years of age or older**.

By enrolling in the Program, you agree to these SMS Terms and to our **Privacy Policy** at lumzen.co/privacy.

---

### 1) Program Description

The LumZen SMS Program delivers daily practice reminders, content updates, feature announcements, and curated spiritual practice tips focused on tarot, astrology, affirmations, meditation, and personal reflection.

Messages are for informational and promotional purposes only and do not constitute medical, mental health, financial, or legal advice. Always consult a qualified professional for matters affecting your health, finances, or legal situation.

---

### 2) Consent to Receive Messages

By providing your mobile number and opting in to the Program (for example, by checking the SMS opt-in box on lumzen.co or by texting our keyword to our short code or number), you provide your **prior express written consent under the federal Telephone Consumer Protection Act (TCPA)** to receive recurring marketing and promotional text messages from LumZen sent using an automatic telephone dialing system or otherwise.

You confirm that:

- You are the subscriber of the mobile number provided, or are authorized to provide it
- You are at least 18 years of age
- You are located in the United States

**Consent is not a condition of using any LumZen service.** You may receive messages from LumZen even if you have not made a purchase, provided you have opted in.

---

### 3) Message Frequency

Message frequency varies. By default, you may receive **multiple messages per week**. Message content will include informational, marketing, and promotional texts. We do not guarantee any specific number or timing of messages.

---

### 4) Message and Data Rates

**Message and data rates may apply** for any messages sent to you from LumZen and to LumZen from you. If you have any questions about your text plan or data plan, please contact your wireless provider. LumZen is not responsible for any wireless carrier charges.

---

### 5) Opting Out (STOP)

You can cancel the SMS service at any time. Just text **"STOP"** to the short code or number from which you receive our messages. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us through the Program.

If you want to join again, just sign up as you did the first time, and we will start sending SMS messages to you again.

Other recognized opt-out keywords include **END, CANCEL, UNSUBSCRIBE,** and **QUIT**. Opt-out requests apply to the Program from which you opt out. If you participate in more than one LumZen messaging program, you may need to opt out separately from each.

---

### 6) Getting Help (HELP)

If you are experiencing issues with the messaging program, you can reply with the keyword **"HELP"** for more assistance, or you can get help directly at **privacy@lumzen.co**.

---

### 7) Supported Carriers and Carrier Liability

The Program is generally available on major U.S. wireless carriers, including (but not limited to) **AT&T, Verizon Wireless, T-Mobile, US Cellular**, and their applicable affiliates and resellers.

**Carriers are not liable for delayed or undelivered messages.** Carrier participation is subject to change without notice.

---

### 8) Eligibility

To participate in the Program, you must:

- be **at least 18 years of age**
- be **located in the United States**
- be the subscriber of the mobile number provided, or be authorized by the subscriber to enroll that number, and
- agree to these SMS Terms and our Privacy Policy

If you change or deactivate the mobile number provided to us, you agree to promptly update your information by texting STOP from that number or by emailing privacy@lumzen.co to avoid messages being sent to a person who is not the intended subscriber.

---

### 9) Privacy

If you have any questions regarding privacy, please read our Privacy Policy at **lumzen.co/privacy**.

- **No mobile information will be sold or shared with third parties or affiliates for marketing or promotional purposes.**
- **Text messaging originator opt-in data and consent will not be shared with any third parties**, except with vendors that help us deliver and operate the Program (for example, messaging platform providers, delivery vendors, and telecom carriers), and only as needed for those services.

---

### 10) No Professional Advice

LumZen is not a healthcare provider, mental health professional, financial advisor, or legal advisor. The Program is not designed to receive or transmit protected health information under HIPAA.

Information delivered through the Program is provided for **general informational and reflective purposes only** and is not a substitute for professional advice. Always seek the advice of a qualified professional with any questions you may have regarding your health, finances, legal situation, or mental wellbeing. Never disregard professional advice or delay seeking it because of something you received through the Program.

**Mental health emergencies:** If you are experiencing a mental health crisis, contact emergency services (911 in the US) or the **988 Suicide and Crisis Lifeline**.

Please do not send sensitive personal information by text. We cannot guarantee the security of information transmitted by SMS.

---

### 11) Disclaimer of Warranties

THE PROGRAM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, LUMZEN AND ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS, DISCLAIM ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTY THAT MESSAGES WILL BE TIMELY, UNINTERRUPTED, OR ERROR-FREE.

---

### 12) Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY LAW, LUMZEN AND ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS, WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO THE PROGRAM, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST DATA, OR DELAYED OR UNDELIVERED MESSAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN DAMAGES, SO SOME OF THESE LIMITATIONS MAY NOT APPLY TO YOU.

---

### 13) Changes to the Program or These SMS Terms

We may modify or terminate the Program, or update these SMS Terms, at any time, with or without notice. Your continued participation in the Program after any changes are posted on lumzen.co constitutes your acceptance of the updated SMS Terms. If we make a material change that affects your rights, we will use reasonable efforts to notify you, including (where appropriate) by SMS or email.

---

### 14) Governing Law

These SMS Terms and any dispute arising out of or relating to the Program will be governed by the laws of the **Province of [PROVINCE — TBD], Canada**, without regard to its conflict of laws principles, and by applicable U.S. federal law (including the TCPA). For users located in the United States, we acknowledge rights and protections under applicable US federal and state laws.

Subject to any applicable mandatory consumer protection laws, you and LumZen agree to resolve any dispute that is not otherwise required to be resolved as set forth in our Terms of Service.

---

### 15) Contact Us

If you have questions about these SMS Terms or the Program, please contact us:

- **Email:** privacy@lumzen.co
- **Website:** lumzen.co

---

*End of SMS Terms & Conditions*

---

## 4. SUBSCRIBE PAGE OPT-IN COPY

**File path:** `app/subscribe/page.tsx`
**Route:** `https://lumzen.co/subscribe`
**Purpose:** Standalone subscribe page (not the popup)

---

### Page header
```
Eyebrow:  ✦ JOIN THE COMMUNITY
H1:       Receive the practice in your inbox
Subtitle: Daily card, weekly reflections, and quiet announcements.
          No noise, no urgency, no marketing tricks.
```

### Form structure

```
┌────────────────────────────────────────────────────────────┐
│ ✦ JOIN THE COMMUNITY                                       │
│                                                            │
│ Receive the practice in your inbox                         │
│                                                            │
│ Daily card, weekly reflections, and quiet announcements.   │
│ No noise, no urgency, no marketing tricks.                 │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Your email                                           │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Your name (optional)                                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Mobile number (optional, US only)                    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ☐  I want to receive practice reminders and updates by    │
│    text message from LumZen at the number above.          │
│                                                            │
│    By checking this box, I provide my prior express       │
│    written consent under the TCPA to receive recurring    │
│    marketing text messages from LumZen sent using an      │
│    automatic telephone dialing system. Consent is not     │
│    a condition of using LumZen. Message frequency varies. │
│    Msg & data rates may apply. Reply STOP to cancel,      │
│    HELP for help. See SMS Terms.                          │
│                                                            │
│ By subscribing, you agree to receive marketing emails     │
│ from LumZen. You can unsubscribe at any time. See our     │
│ Privacy Policy and Terms of Service.                      │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │              Subscribe ✦                             │   │
│ └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Exact copy strings to render

**Section eyebrow:**
```
✦ JOIN THE COMMUNITY
```

**H1:**
```
Receive the practice in your inbox.
```

**Subtitle:**
```
Daily card, weekly reflections, and quiet announcements.
No noise, no urgency, no marketing tricks.
```

**Email field label and placeholder:**
- Label: `Your email`
- Placeholder: `you@example.com`

**Name field label and placeholder:**
- Label: `Your name (optional)`
- Placeholder: `Your first name`

**Mobile field label and placeholder:**
- Label: `Mobile number (optional · US only)`
- Placeholder: `+1 (555) 123-4567`
- Helper text under field: `For text message reminders, US numbers only.`

**SMS opt-in checkbox label (required text — do NOT shorten):**

```
I want to receive practice reminders and updates by text message
from LumZen at the number above.
```

**SMS consent disclosure (appears in lighter text below the checkbox, required text — do NOT shorten):**

```
By checking this box, I provide my prior express written consent
under the TCPA to receive recurring marketing text messages from
LumZen sent using an automatic telephone dialing system. Consent
is not a condition of using LumZen. Message frequency varies.
Msg & data rates may apply. Reply STOP to cancel, HELP for help.
See SMS Terms.
```

(`SMS Terms` is a link to `/sms-terms`.)

**Email consent disclosure (appears above the submit button, required text):**

```
By subscribing, you agree to receive marketing emails from LumZen.
You can unsubscribe at any time using the link in any email.
See our Privacy Policy and Terms of Service.
```

(`Privacy Policy` links to `/privacy`, `Terms of Service` links to `/terms`.)

**Submit button label:**
```
Subscribe ✦
```

**Success state (after submission):**

```
✦ Welcome to the community.

A welcome message has been sent to [email].
Check your inbox (and your spam folder, just in case).

If you opted in for text messages, you'll receive a confirmation
shortly — reply Y to confirm.
```

**Error state (validation):**

```
We need a valid email address to send you the practice.
```

**Error state (already subscribed):**

```
This email is already on the list. You're already here ✦
```

### Compliance requirements for the form (technical)

- **Two separate checkboxes** if you collect both email and SMS — TCPA prohibits bundling SMS consent with email consent
- **SMS checkbox MUST default to unchecked** — pre-checked boxes violate TCPA
- **Submit button MUST be inactive until email checkbox is checked** OR clearly state that submitting = email consent
- **Capture and store:** `email_consent_at` (timestamp), `sms_consent_at` (timestamp, NULL if SMS not opted in), `ip_address`, `user_agent`, `consent_form_url` (so you can prove which page the consent came from)
- **Confirmation message** (the success state above) is part of the TCPA "prior express written consent" record — keep server-side proof of what the user saw

---

## 5. SUBSCRIBE POPUP OPT-IN COPY

**Component path:** `components/subscribe-popup.tsx`
**Trigger:** 5 seconds after page load, session-scoped (don't reappear in same session if dismissed), foreground-paused (don't pop while tab is inactive)
**Excluded paths:** `/admin/*`, `/auth/*`, `/api/*`, `/dashboard/*`, `/subscribe`, `/privacy`, `/terms`, `/sms-terms`

---

### Popup structure

```
┌──────────────────────────────────────────────────┐
│                                              ✕   │
│                                                  │
│                   ✦                              │
│                                                  │
│       Before you wander further...               │
│                                                  │
│   Receive the daily card, weekly reflections,    │
│        and quiet announcements from us.          │
│                                                  │
│   ┌────────────────────────────────────────┐    │
│   │ Your email                             │    │
│   └────────────────────────────────────────┘    │
│                                                  │
│   By subscribing, you agree to receive marketing │
│   emails from LumZen. You can unsubscribe at any │
│   time. See our Privacy Policy.                  │
│                                                  │
│   ┌────────────────────────────────────────┐    │
│   │           Join the Community ✦         │    │
│   └────────────────────────────────────────┘    │
│                                                  │
│           No, thank you                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Exact copy strings

**Glyph at top:**
```
✦
```

**Headline (Cormorant italic, ~28px):**
```
Before you wander further...
```

**Body (Jost, 14px, secondary text):**
```
Receive the daily card, weekly reflections, and
quiet announcements from us.
```

**Email field placeholder:**
```
Your email
```

**Consent disclosure (small, muted text, required):**
```
By subscribing, you agree to receive marketing emails
from LumZen. You can unsubscribe at any time using the
link in any email. See our Privacy Policy.
```

(`Privacy Policy` links to `/privacy`.)

**Primary CTA button:**
```
Join the Community ✦
```

**Dismiss link (under button):**
```
No, thank you
```

**Success state (replaces popup contents):**
```
✦

Welcome.

A welcome message has been sent to [email].
Check your inbox.
```

**Note:** The popup does NOT collect SMS opt-in — that requires the full form on `/subscribe`. The popup is email-only to keep the friction low and to avoid TCPA-bundling concerns.

### Popup compliance requirements (technical)

- **Session storage flag** to prevent reappearance after dismissal in same session
- **Capture and store:** `email_consent_at`, `ip_address`, `user_agent`, `consent_form_url = "/popup"` (so you can prove popup-sourced consent)
- **5-second delay** before first appearance
- **Foreground-pause** — use `document.visibilityState === 'visible'` check
- **Escape key dismisses** the popup
- **Click-outside dismisses** the popup
- **No SMS field** in the popup — keep it email-only

---

## 6. FOOTER DISCLOSURE LINKS

**Location:** Site footer (visible on every public page)
**Component path:** `components/footer.tsx`

### Required links (in this order)

```
About    Privacy Policy    Terms of Service    SMS Terms    Contact
```

### Required disclosure text in footer (small, muted, single line)

```
LumZen is operated by DemianSpirits (Canada). Services available to US residents only.
© 2026 DemianSpirits. All rights reserved. ✦ Where Light Meets Stillness.
```

### CCPA / Do Not Sell link (required in footer for California compliance)

```
Do Not Sell or Share My Personal Information
```

Links to a section of `/privacy` (anchor `#do-not-sell`) or a dedicated `/do-not-sell` page that confirms LumZen does not sell personal information. Since LumZen does not sell, the page text can simply state:

```
✦ Your Choice Respected

LumZen does not sell your personal information. We also do not share
your personal information for cross-context behavioral advertising as
those terms are defined under California law.

For details about how your information is used and shared, see our
Privacy Policy.

If you would like to opt out of interest-based advertising more
broadly, visit the Digital Advertising Alliance at optout.aboutads.info
or the Network Advertising Initiative at optout.networkadvertising.org.

For any other privacy request, email privacy@lumzen.co.
```

---

## 7. WELCOME EMAIL BODY

**File path:** `emails/welcome-email.tsx` (React Email component)
**Trigger:** Sent immediately after a user subscribes via subscribe page, popup, or account signup

### Subject line
```
Welcome to LumZen ✦
```

### Preheader (preview text shown in inbox)
```
Your first daily card is waiting. Open when you have a quiet moment.
```

### Email body

```
[LumZen logo / ✦ glyph centered, gold on dark]

Welcome.

You're now part of the LumZen community — a quiet, curious
space for tarot, astrology, affirmations, meditation, and
reflection.

Here's what you can expect from us:

✦ A daily card pull each morning (if you've opted in)
✦ Weekly reflections on the moon's phase
✦ Occasional notes on new features
✦ Nothing else. No noise.

[Visit Your Sanctuary ✦]    (button → https://lumzen.co/dashboard)

If you didn't sign up for LumZen, you can safely ignore this
email or unsubscribe below.

—

About LumZen:
LumZen is a free, ad-supported spiritual practice platform.
It is for entertainment and personal reflection only — not a
substitute for professional medical, mental health, financial,
or legal advice. If you are in crisis, please contact emergency
services or the 988 Suicide and Crisis Lifeline.

Privacy Policy · Terms of Service · SMS Terms

Unsubscribe from these emails | Update your preferences

DemianSpirits (operating as LumZen)
[CANADIAN POSTAL ADDRESS — required by CAN-SPAM, must be a
valid physical address, can be a registered office or P.O. Box]

✦ Where Light Meets Stillness.
```

### CAN-SPAM compliance requirements (must be in every marketing email)

- **Valid physical postal address** of DemianSpirits
- **Clear unsubscribe link** that processes within 10 business days
- **Subject line accurately reflects content** — never misleading
- **From name and reply-to** identify LumZen clearly
- **Honest header information** — don't spoof anything

---

## 8. CLAUDE CODE BUILD INSTRUCTIONS

> **Save this file at `$HOME/lumzen/docs/LEGAL-CONTENT.md` so Claude Code can read it when building the legal pages and subscribe components.**

### When to use this document

Claude Code will reference this document when building these specific files (most happen during **Stage 2 Worktree 2**):

| File to build | Section to read |
|---|---|
| `app/privacy/page.tsx` | §1 Privacy Policy |
| `app/terms/page.tsx` | §2 Terms of Service |
| `app/sms-terms/page.tsx` | §3 SMS Terms & Conditions |
| `app/subscribe/page.tsx` | §4 Subscribe Page Opt-In Copy |
| `components/subscribe-popup.tsx` | §5 Subscribe Popup Opt-In Copy |
| `components/footer.tsx` | §6 Footer Disclosure Links |
| `app/do-not-sell/page.tsx` | §6 CCPA Do Not Sell |
| `emails/welcome-email.tsx` | §7 Welcome Email Body |

### Build instructions

#### 8.1 Legal pages (Privacy, Terms, SMS Terms)

Render each legal page using a shared `<LegalLayout>` component that provides:

- Public marketing layout chrome (header, footer, cosmic background — but **without** the animated star field on these pages to keep them readable and professional)
- Max-width 720px content area, centered
- Cormorant Garamond for H1 and section headings (H2, H3)
- Jost for body text
- Generous line-height (1.7 for body, 1.3 for headings)
- Eyebrow label in Cinzel `✦ LEGAL` at top in gold
- "Effective Date" and "Last Updated" in JetBrains Mono in muted text
- Anchor links (`#section-1`, `#section-2`, etc.) on every numbered section so privacy requests can deep-link
- A floating table of contents on the right side at md+ breakpoints (sticky, anchor links)
- A "Last reviewed by counsel: [DATE]" line in footer (small, muted) — leave as `[Pending legal review]` for now

#### 8.2 Date placeholders

The phrase `[INSERT LAUNCH DATE]` appears in three places (Privacy, Terms, SMS Terms). When building, replace with a constant:

```typescript
// lib/legal/constants.ts
export const LEGAL_EFFECTIVE_DATE = "May 18, 2026";   // UPDATE this on every revision
export const LEGAL_LAST_UPDATED  = "May 18, 2026";    // UPDATE this on every revision
```

#### 8.3 Province placeholder

In Terms of Service §14 and SMS Terms §14, the text reads `Province of [PROVINCE — TBD]`. Before building, **ask the user** which Canadian province DemianSpirits is registered in. Common answers:

- Ontario
- British Columbia
- Alberta
- Quebec

The user must tell you before the legal pages can ship. If unclear, leave the placeholder and flag it as a blocker.

#### 8.4 Postal address placeholder

In the welcome email and (potentially) the footer, `[CANADIAN POSTAL ADDRESS]` must be replaced with the registered office of DemianSpirits. **Ask the user for this address** before building the welcome email.

#### 8.5 Subscribe form technical requirements

Build `app/subscribe/page.tsx` with these compliance constraints:

```typescript
// Required form structure
- Email input (required)
- Name input (optional)
- Phone input (optional)
- Email-implicit consent (disclosed above submit button)
- SMS opt-in checkbox (DEFAULT UNCHECKED)
- Submit button

// Backend (POST /api/subscribe) must capture:
{
  email: string,
  name?: string,
  phone?: string,           // null if not provided
  email_consent_at: Date,   // ALWAYS set on successful subscribe
  sms_consent_at: Date | null,  // ONLY set if SMS box was checked AND phone was provided
  ip_address: string,
  user_agent: string,
  consent_form_url: "/subscribe" | "/popup",  // distinguish source
  source: "subscribe_page" | "popup" | "account_signup"
}

// Validation rules:
- Email format must be valid
- If SMS checkbox checked: phone must be provided and must be a US number (+1)
- If phone provided but SMS checkbox unchecked: DO NOT set sms_consent_at
- Disallow phone-only submissions (must always have email)

// Send welcome email via Resend AFTER successful database insert
// If SMS opt-in, send SMS confirmation message asking user to reply Y to confirm
```

#### 8.6 Subscribe popup technical requirements

Build `components/subscribe-popup.tsx` and `lib/popup-context.tsx`:

```typescript
// Popup behavior
- Mount delay: 5000ms after first page load
- Session flag: sessionStorage.getItem('lumzen_popup_dismissed') prevents re-appearance
- Visibility check: only show when document.visibilityState === 'visible'
- Excluded paths (do not render popup on these):
  - /admin/*
  - /auth/*
  - /api/*
  - /dashboard/*
  - /subscribe
  - /privacy
  - /terms
  - /sms-terms
  - /do-not-sell

// Popup form
- Email input only (no SMS, no name)
- Submit button: "Join the Community ✦"
- Dismiss link: "No, thank you"

// Backend uses same /api/subscribe endpoint with source="popup"
```

#### 8.7 Footer technical requirements

Build `components/footer.tsx`:

```typescript
// Footer renders on all public pages
// Hidden on /dashboard/*, /admin/*, /auth/* (those use their own chrome)
// Required links:
- About → /about
- Privacy Policy → /privacy
- Terms of Service → /terms
- SMS Terms → /sms-terms
- Do Not Sell or Share My Personal Information → /do-not-sell
- Contact → /contact

// Required disclosure text (small, muted, single line):
"LumZen is operated by DemianSpirits (Canada). Services available to US residents only."
"© [YEAR] DemianSpirits. All rights reserved. ✦ Where Light Meets Stillness."

// Year should be auto-computed:
const year = new Date().getFullYear();
```

#### 8.8 Welcome email technical requirements

Build `emails/welcome-email.tsx` using React Email components:

- Render against a dark `#06060f` background with the LumZen ✦ glyph in gold at top
- Cormorant Garamond for the "Welcome." headline
- Jost for body
- Primary CTA button: gold `#c4a35a` background, dark text, rounded full
- Required CAN-SPAM elements (all in footer of email):
  - Canadian postal address (required, use constant from `lib/legal/constants.ts`)
  - Unsubscribe link (handled via Resend's unsubscribe API or your own `/unsubscribe?token=...` route)
  - Privacy Policy link
  - Terms of Service link
  - SMS Terms link
- Test render in three clients before launch: Gmail web, Apple Mail, Outlook

#### 8.9 Database migration for consent tracking

The `subscribers` table created in Stage 1 needs these specific fields for compliance — if they aren't already in the migration, add them now:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,                                    -- E.164 format, US numbers only
  email_consent_at TIMESTAMPTZ NOT NULL,         -- when email consent was given
  sms_consent_at TIMESTAMPTZ,                    -- NULL if SMS not opted in
  email_unsubscribed_at TIMESTAMPTZ,             -- when user unsubscribed
  sms_unsubscribed_at TIMESTAMPTZ,               -- when user opted out of SMS
  ip_address INET,                               -- IP at time of consent
  user_agent TEXT,                               -- browser/device at time of consent
  consent_form_url TEXT,                         -- e.g. "/subscribe" or "/popup"
  source TEXT,                                   -- "subscribe_page" | "popup" | "account_signup"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast unsubscribe lookups
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_phone ON subscribers(phone) WHERE phone IS NOT NULL;
```

#### 8.10 Unsubscribe endpoints

Two unsubscribe paths are required:

**Email unsubscribe:**
- Route: `GET /api/unsubscribe?token={hmac_signed_email}`
- Verifies the HMAC signature, updates `email_unsubscribed_at`, returns a confirmation page
- The token in marketing email footers is generated server-side as `HMAC-SHA256(email, UNSUBSCRIBE_SECRET)`

**SMS unsubscribe (handled by SMS provider):**
- Configured at the SMS provider level (Twilio, etc.)
- When user texts STOP, the provider sends a webhook to `/api/sms/webhook`
- Webhook handler updates `sms_unsubscribed_at` for the matching phone number

#### 8.11 Voice and tone compliance

Every word of these legal pages must respect the LumZen brand voice in `docs/BRAND.md`:

- **No exclamation marks anywhere in the legal copy** (legal text naturally avoids them, but double-check)
- **No banned vocabulary** from BRAND.md §2.3 — these pages use clear, plain language but should not break the voice
- **The eyebrow label** `✦ LEGAL` and the brand glyph `✦` are the only ornamental elements
- **Headings in Cormorant**, body in Jost, dates in JetBrains Mono
- **No emoji in legal copy** (other than the brand glyph ✦ which is a Unicode symbol, not an emoji)
- **Tone is calm, factual, respectful** — these pages are part of the brand experience

#### 8.12 Final verification checklist for Claude Code

Before declaring legal pages complete, verify:

- [ ] `/privacy`, `/terms`, `/sms-terms` all render and pass `pnpm build`
- [ ] `[INSERT LAUNCH DATE]` placeholders replaced with `LEGAL_EFFECTIVE_DATE` constant
- [ ] `[PROVINCE — TBD]` placeholders replaced with the province the user specified
- [ ] `[CANADIAN POSTAL ADDRESS]` replaced with the registered office address
- [ ] Subscribe page renders with email + phone + SMS checkbox
- [ ] SMS checkbox defaults to unchecked
- [ ] Form submission stores `email_consent_at`, `sms_consent_at`, `ip_address`, `user_agent`, `consent_form_url`, `source`
- [ ] Welcome email sends after subscription
- [ ] Welcome email contains valid postal address and unsubscribe link
- [ ] Popup appears after 5s on public pages, not on dashboard or admin
- [ ] Popup dismiss persists for the session
- [ ] Footer renders on public pages with all required links
- [ ] `Do Not Sell` page renders at `/do-not-sell`
- [ ] All legal pages have anchor links on numbered sections
- [ ] No exclamation marks in legal copy
- [ ] No banned vocabulary in legal copy
- [ ] HTML page titles set correctly (e.g., "Privacy Policy · LumZen")
- [ ] Meta descriptions set for SEO (one line summary of each page)
- [ ] All cross-links between legal pages work (`/privacy` ↔ `/terms` ↔ `/sms-terms` ↔ `/do-not-sell`)

---

### Open items (ask the user before building)

Before Claude Code begins building these pages, the user must provide:

1. **Canadian province** of registration (Ontario / BC / Alberta / Quebec / other)
2. **Canadian postal address** of registered office (required for CAN-SPAM)
3. **Launch date** (used as Effective Date and Last Updated date)
4. **SMS provider choice** (Twilio is the assumed default; if a different provider, update the privacy policy disclosure)
5. **Whether to use a 10DLC short code or a long code** for SMS (affects the SMS Terms wording — currently written for long-code, but easy to swap)

If any of these are missing, the legal pages can still be built with bracketed placeholders, and the user replaces them before launch.

---

*LumZen Legal Pages & Opt-In Copy — Version 1.0 — May 18, 2026*
*Save as `$HOME/lumzen/docs/LEGAL-CONTENT.md` for Claude Code reference*

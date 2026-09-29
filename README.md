# BPM — Blockchain Powered Musicians

A single-page onboarding site for musicians minting their first release as an
NFT. It covers blockchain basics, wallet setup across six chains, wallet
safety, and a signup form that emails new members an onboarding archive
(working mind map + walkthrough deck). Built and stewarded by **M0B**
(Musicians On Blockchain), the artist collective behind it.

**Live site:** https://misty-lake-25c6.0x-xtinct.workers.dev/

## What's in this repo

```
.
├── index.html                       # the entire site — static HTML/CSS/JS, no build step
├── og-image.png                     # social share preview image (Open Graph / Twitter card)
├── backend/
│   └── bpm-signup-backend.gs        # Google Apps Script source for the signup backend
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

`index.html` is fully self-contained: no bundler, no npm install, no framework.
Open it directly in a browser and it works, aside from the signup form (see
below). `og-image.png` needs to sit alongside `index.html` at the same path
referenced in the page's Open Graph tags for link previews to render correctly.

## Features

- Wallet setup guides + real download links for six chains (EVM, Polkadot,
  Tezos, Cardano, XRPL, Bitcoin)
- Per-chain wallet address format validation on the signup form (client-side)
- Honeypot field + submit-timing check for spam/bot resistance on the backend
- Self-hosted, cookie-free pageview logging (no third-party analytics)
- Open Graph / Twitter card meta tags + inline favicon for link previews
- Privacy note disclosing what signup data is used for

## Deploying your own copy

Any static host works. The site was built and tested against **Cloudflare
Workers (static assets)**:

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** tab →
   **Upload assets** (no build command needed), *or* connect this repo via
   **Connect to Git** for auto-deploy on every push to `main`.
2. Make sure the deployed file is named exactly `index.html` at the root —
   that's what gets served at `/`. Upload `og-image.png` alongside it.

GitHub Pages, Netlify, or Vercel all work identically for a static file like
this if you'd rather use one of those instead.

## Wiring up the signup form (backend)

The signup form posts to a Google Apps Script Web App, which writes each
submission to a Google Sheet and sends a welcome email with the onboarding
links. This is a zero-cost setup — no server, no paid services.

1. **Create a Google Sheet.** Any name works; the script creates its own
   `Signups` and `PageViews` tabs (with header rows) on first use.
2. **Extensions → Apps Script**, and paste in the contents of
   `backend/bpm-signup-backend.gs`.
3. At the top of the script, set `SHEET_ID` to your Sheet's ID (the long
   string in its URL between `/d/` and `/edit`).
4. **Deploy → New deployment → Web app.**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the generated URL (ends in `/exec`).
6. In `index.html`, find:
   ```js
   var SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
   and replace the placeholder with your deployed URL.
7. Submit the form once yourself to confirm a row appears in the `Signups`
   tab and the welcome email arrives.

**Important:** `SpreadsheetApp.getActiveSpreadsheet()` does not work inside a
web app execution context — always reference the Sheet with
`SpreadsheetApp.openById(SHEET_ID)`, which is what this script already does.

**Email quota:** `MailApp.sendEmail` sends as whichever Google account owns
the deployed script — 100 emails/day on a free Gmail account, 1,500/day on
Google Workspace. If you outgrow that, swap `sendWelcomeEmail()` for a
transactional email API (Resend, SendGrid, Postmark).

**Note on the request pattern:** the form submits with `fetch(..., { mode:
'no-cors' })`, because browsers can't reliably read a response from an Apps
Script Web App. This means the success screen shows optimistically — the
`Signups` sheet (and your inbox) are the actual source of truth for whether a
submission worked.

**Spam protection:** the backend silently drops (but still returns success
for) any submission that either fills the hidden honeypot field or arrives
less than 2.5 seconds after the page loaded. Both are checked server-side, not
just in the front-end JS, so a bot posting directly to the endpoint doesn't
bypass them.

**Analytics:** `index.html` fires a fire-and-forget `GET` request to the same
Apps Script URL on page load (`?event=pageview`), which logs a row to the
`PageViews` tab. No cookies, no third-party service, no token to configure —
just a row per visit.

## Tech stack

- Vanilla HTML / CSS / JS — no dependencies, no build step
- Google Apps Script + Google Sheets — signup backend, email automation, and
  pageview logging
- Cloudflare Workers (static assets) — hosting

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)

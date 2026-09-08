/**
 * M0B — SIGNUP BACKEND (zero-cost route)
 * -----------------------------------------
 * SETUP:
 * 1. Create a new Google Sheet (any name).
 * 2. Extensions > Apps Script. Delete any starter code and paste this whole file in.
 * 3. Click Deploy > New deployment > select type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Click Deploy, authorize the permissions it asks for (it's your own script).
 * 5. Copy the "Web app URL" it gives you.
 * 6. Paste that URL into SCRIPT_URL in the landing page's <script> section.
 *
 * QUOTA NOTE: MailApp.sendEmail uses your Google account's daily email quota
 * (100/day on a free Gmail account, 1,500/day on Google Workspace). Fine for
 * getting started; if signups outgrow that, move sendWelcomeEmail() to a
 * transactional email API (Resend, SendGrid, Postmark) instead.
 */

var SHEET_ID = '1CX1J2GfYP3YlOPyzVz6tsCHuvcN8lZEtQmpsg8D-eG0';
var SHEET_NAME = 'Signups';

var MIRO_LINK = 'https://miro.com/app/board/o9J_kqkQyeI=/?moveToWidget=3458764514051869007&cot=14';
var SLIDES_LINK = 'https://docs.google.com/presentation/d/10DesrKKe9Vd_xIjJ_7yJ9j1-n0j9D0xx/edit?usp=sharing&ouid=113354780348049653404&rtpof=true&sd=true';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),
      data.artistName || '',
      data.email || '',
      data.artistLink || '',
      (data.wallets && data.wallets.evm) || '',
      (data.wallets && data.wallets.polkadot) || '',
      (data.wallets && data.wallets.tezos) || '',
      (data.wallets && data.wallets.cardano) || '',
      (data.wallets && data.wallets.xrpl) || '',
      (data.wallets && data.wallets.bitcoin) || '',
      (data.wallets && data.wallets.other) || ''
    ]);

    if (data.email) {
      sendWelcomeEmail(data.email, data.artistName);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('doPost failed: ' + err);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you sanity-check the deployed URL in a browser — should show this text.
function doGet(e) {
  return ContentService.createTextOutput('M0B signup endpoint is live.');
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Artist Name', 'Email', 'Link',
      'EVM', 'Polkadot', 'Tezos', 'Cardano', 'XRPL', 'Bitcoin', 'Other'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendWelcomeEmail(toEmail, artistName) {
  var subject = 'Welcome to M0B — your onboarding archive';
  var greetName = artistName || 'there';

  var htmlBody =
    '<div style="font-family: monospace, monospace; background:#07060B; color:#ECE9F5; padding:32px; border-radius:12px;">' +
      '<h2 style="color:#FF2E6C; margin-top:0;">&gt; ACCESS GRANTED</h2>' +
      '<p>Hey ' + escapeHtml(greetName) + ',</p>' +
      '<p>Welcome to Musicians On Blockchain. Here is your onboarding archive:</p>' +
      '<ul style="line-height:1.9;">' +
        '<li><a href="' + MIRO_LINK + '" style="color:#2EE6D6;">Music Blockchain Initiatives (Miro)</a></li>' +
        '<li><a href="' + SLIDES_LINK + '" style="color:#2EE6D6;">Goodwaves Onboarding sesh (Google Slides)</a></li>' +
      '</ul>' +
      '<p>Read the deck, secure your wallet, and we will see you on-chain.</p>' +
      '<p style="color:#8B85A3;">— M0B</p>' +
    '</div>';

  var plainBody =
    'Welcome to M0B, ' + greetName + '.\n\n' +
    'Your onboarding archive:\n' +
    'Miro board: ' + MIRO_LINK + '\n' +
    'Goodwaves Onboarding sesh: ' + SLIDES_LINK + '\n\n' +
    '— M0B';

  MailApp.sendEmail({
    to: toEmail,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'M0B — Musicians On Blockchain'
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

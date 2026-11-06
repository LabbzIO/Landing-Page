/**
 * labbz.io forms → Google Sheet + email notification.
 *
 * Paste this whole file into Extensions → Apps Script of a new Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Steps in README.md, section "Form submissions".
 *
 * Every submission is added as a row: Investors (Invest form) or Enquiries
 * (Contact and Request a call). An email goes to the Google account that owns
 * this script, plus any address in ALSO_NOTIFY.
 */

// Extra addresses to notify, comma separated. Leave '' to notify only you.
const ALSO_NOTIFY = '';

const SHEETS = {
  invest: {
    name: 'Investors',
    cols: ['Received', 'Name', 'Email', 'Mobile', 'Cheque size', 'Language', 'Page'],
    keys: ['received', 'name', 'email', 'mobile', 'cheque', 'lang', 'page'],
  },
  contact: {
    name: 'Enquiries',
    cols: ['Received', 'Topic', 'Name', 'Email', 'Mobile', 'Organisation', 'Product', 'Message', 'Language', 'Page'],
    keys: ['received', 'reason', 'name', 'email', 'mobile', 'org', 'product', 'message', 'lang', 'page'],
  },
};

const TOPICS = {
  invest: 'Investing', call: 'Request a call', pilot: 'Run a pilot',
  partner: 'Partnerships & integrations', press: 'Press', careers: 'Careers',
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const spec = SHEETS[d.form === 'invest' ? 'invest' : 'contact'];
    if (!clean(d.name) || !clean(d.email)) return reply({ ok: false, error: 'missing' });
    if (d.reason) d.reason = TOPICS[d.reason] || d.reason;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(spec.name) || ss.insertSheet(spec.name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(spec.cols);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, spec.cols.length).setFontWeight('bold');
    }
    const row = spec.keys.map(k => (k === 'received' ? new Date() : clean(d[k])));
    sh.appendRow(row);

    notify(spec, row, d, ss.getUrl());
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'server' });
  } finally {
    lock.releaseLock();
  }
}

// Plain text only, capped in length; a leading = + - @ is escaped so a cell can never run as a formula.
function clean(v) {
  const s = v == null ? '' : String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, 4000).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function notify(spec, row, d, sheetUrl) {
  const to = [Session.getEffectiveUser().getEmail(), ALSO_NOTIFY].filter(Boolean).join(',');
  const name = clean(d.name);
  const subject = spec.name === 'Investors'
    ? `New investor request: ${name}`
    : `New enquiry (${clean(d.reason) || 'Contact'}): ${name}`;
  const lines = spec.cols.map((c, i) => `${c}: ${row[i] instanceof Date ? row[i].toISOString() : row[i]}`);
  const email = String(d.email || '').trim();
  const msg = {
    to,
    subject,
    name: 'labbz.io forms',
    body: lines.join('\n') + `\n\nAll submissions: ${sheetUrl}`,
  };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msg.replyTo = email;
  MailApp.sendEmail(msg);
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (select testSetup, press Run) to grant permissions and see a test row and email.
function testSetup() {
  doPost({ postData: { contents: JSON.stringify({
    form: 'contact', reason: 'call', name: 'Test from setup', email: 'test@example.com',
    mobile: '+966 50 000 0000', message: 'Setup test. You can delete this row.', lang: 'en', page: 'setup',
  }) } });
}

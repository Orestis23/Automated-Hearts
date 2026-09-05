/*
  Automated Hearts — Google Sheets form receiver

  SETUP (one time):
  1. Create/open the Google Sheet that should receive website form entries.
  2. In the Sheet choose Extensions > Apps Script.
  3. Replace the default Code.gs with this file.
  4. Run setup() once and approve the requested permissions.
  5. Deploy > New deployment > Web app.
     Execute as: Me
     Who has access: Anyone
  6. Copy the Web App /exec URL into:
     assets/google-sheet-config-round1118.js
*/

const AH_TAB_NAME = 'Website Form Entries';
const AH_NOTIFICATION_EMAIL = 'automatedhearts@gmail.com';

function setup() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) throw new Error('Open this Apps Script project from the target Google Sheet, then run setup() again.');
  PropertiesService.getScriptProperties().setProperty('AH_SHEET_ID', active.getId());
  ensureSheet_(active);
}

function doPost(e) {
  try {
    const sheetId = PropertiesService.getScriptProperties().getProperty('AH_SHEET_ID');
    if (!sheetId) throw new Error('Run setup() once before using the web app.');

    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ensureSheet_(ss);
    const p = (e && e.parameter) ? e.parameter : {};

    const name = clean_(p.name, 200);
    const email = clean_(p.email, 320);
    const business = clean_(p.business, 300);
    const businessType = clean_(p.business_type, 200);
    const message = clean_(p.message, 5000);
    const page = clean_(p.page, 250);
    const pageUrl = clean_(p.page_url, 1000);
    const contactContext = clean_(p.contact_context, 500);
    const clientTime = clean_(p.submitted_at_client, 100);
    const formVersion = clean_(p.form_version, 50);

    if (!name || !email || !message) {
      return json_({ok:false, error:'Missing required fields'});
    }

    sheet.appendRow([
      new Date(),
      name,
      email,
      business,
      businessType,
      message,
      page,
      pageUrl,
      contactContext,
      clientTime,
      formVersion
    ]);

    if (AH_NOTIFICATION_EMAIL) {
      const subjectName = business || name || email || 'Website inquiry';
      const body = [
        'New Automated Hearts website inquiry',
        '',
        'Name: ' + name,
        'Email: ' + email,
        'Business: ' + business,
        'Business type: ' + businessType,
        'Page: ' + page,
        'Context: ' + contactContext,
        '',
        'Message:',
        message,
        '',
        'Page URL: ' + pageUrl
      ].join('\n');
      MailApp.sendEmail(AH_NOTIFICATION_EMAIL, 'New Website Inquiry — ' + subjectName, body);
    }

    return json_({ok:true});
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:String(err && err.message ? err.message : err)});
  }
}

function doGet() {
  return json_({ok:true, service:'Automated Hearts website form receiver'});
}

function ensureSheet_(ss) {
  let sheet = ss.getSheetByName(AH_TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(AH_TAB_NAME);

  const headers = [
    'Received At',
    'Name',
    'Email',
    'Business / Organization',
    'Business Type',
    'Message',
    'Page',
    'Page URL',
    'Contact Context',
    'Client Submitted At',
    'Form Version'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength || 5000);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

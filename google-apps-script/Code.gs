/**
 * My Planet Services — website lead capture.
 *
 * Paste this into Extensions → Apps Script on the MyPlanetWebsiteLeads sheet,
 * then Deploy → New deployment → Web app.
 *
 *   Execute as:      Me
 *   Who has access:  Anyone
 *
 * "Anyone" is required — the website's server calls this without a Google
 * login. That makes the deployment URL effectively public, which is why every
 * request must carry the shared token below. Without it, anyone who learned the
 * URL could write rows into your sheet.
 *
 * After deploying, set these on the website host (and in .env.local for dev):
 *   SHEETS_WEBHOOK_URL   = the /exec URL this deployment gives you
 *   SHEETS_WEBHOOK_TOKEN = the same value as SHARED_TOKEN below
 */

/** Change this to a long random string, and use the same value on the website. */
var SHARED_TOKEN = 'CHANGE_ME_to_a_long_random_string';

/** Tab the rows are written to. Created automatically if missing. */
var SHEET_NAME = 'Leads';

/**
 * Column order. The website sends an object keyed by `key`; this array decides
 * both the header row and which cell each value lands in, so adding a field
 * means adding one entry here and one in the website's LeadRow interface.
 */
var COLUMNS = [
  { key: 'timestamp',          header: 'Timestamp (IST)',     width: 170 },
  { key: 'formType',           header: 'Form',                width: 80  },
  { key: 'name',               header: 'Name',                width: 150 },
  { key: 'email',              header: 'Email',               width: 220 },
  { key: 'company',            header: 'Company',             width: 150 },
  { key: 'service',            header: 'Service',             width: 200 },
  { key: 'budget',             header: 'Budget',              width: 150 },
  { key: 'message',            header: 'Message',             width: 320 },
  { key: 'callSlot',           header: 'Call Slot',           width: 260 },
  { key: 'estScale',           header: 'Est. Scale',          width: 90  },
  { key: 'estLow',             header: 'Est. Low',            width: 90  },
  { key: 'estHigh',            header: 'Est. High',           width: 90  },
  { key: 'estCurrency',        header: 'Currency',            width: 80  },
  { key: 'estTimeline',        header: 'Est. Timeline',       width: 140 },
  { key: 'estAddons',          header: 'Est. Add-ons',        width: 240 },
  { key: 'estIncluded',        header: 'Included Free',       width: 200 },
  { key: 'region',             header: 'Region',              width: 70  },
  { key: 'timezone',           header: 'Timezone',            width: 150 },
  { key: 'source',             header: 'Source',              width: 170 },
  { key: 'pageUrl',            header: 'Page URL',            width: 220 },
  { key: 'teamEmailStatus',    header: 'Team Email',          width: 110 },
  { key: 'clientEmailStatus',  header: 'Client Email',        width: 110 },
  { key: 'clientEmailTo',      header: 'Client Email To',     width: 200 },
  { key: 'resendId',           header: 'Resend ID',           width: 200 },
  { key: '__manual_status',    header: 'Status',              width: 110 },
  { key: '__manual_owner',     header: 'Owner',               width: 110 },
  { key: '__manual_notes',     header: 'Notes',               width: 300 }
];

/** Values offered in the Status dropdown. Edit to match how you actually work. */
var STATUS_OPTIONS = ['New', 'Contacted', 'Quoted', 'Won', 'Lost', 'Spam'];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.token !== SHARED_TOKEN) {
      return jsonOut({ ok: false, error: 'Unauthorized' });
    }

    var row = payload.row || {};
    var sheet = getOrCreateSheet_();

    var values = COLUMNS.map(function (col) {
      // Manual columns belong to you — never overwritten by an incoming lead.
      if (col.key.indexOf('__manual') === 0) {
        return col.key === '__manual_status' ? 'New' : '';
      }
      var v = row[col.key];
      return v === undefined || v === null ? '' : String(v);
    });

    sheet.appendRow(values);
    formatLastRow_(sheet);

    return jsonOut({ ok: true, row: sheet.getLastRow() });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** Lets you open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  return jsonOut({ ok: true, service: 'My Planet Services lead capture' });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) setUpHeaders_(sheet);
  return sheet;
}

function setUpHeaders_(sheet) {
  var headers = COLUMNS.map(function (c) { return c.header; });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var head = sheet.getRange(1, 1, 1, headers.length);
  head.setFontWeight('bold')
      .setBackground('#1F1E1C')
      .setFontColor('#FFFFFF')
      .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(4); // keep Timestamp → Email visible while scrolling

  COLUMNS.forEach(function (col, i) {
    sheet.setColumnWidth(i + 1, col.width);
  });

  // Status dropdown on the manual column, applied generously down the sheet.
  var statusCol = colIndex_('__manual_status');
  if (statusCol > 0) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, statusCol, 5000, 1).setDataValidation(rule);
  }
}

function formatLastRow_(sheet) {
  var r = sheet.getLastRow();
  var range = sheet.getRange(r, 1, 1, COLUMNS.length);
  range.setVerticalAlignment('top').setWrap(false);

  // Only the free-text columns wrap; wrapping everything makes rows tall and
  // the sheet unscannable.
  ['message', 'estAddons', '__manual_notes'].forEach(function (key) {
    var c = colIndex_(key);
    if (c > 0) sheet.getRange(r, c).setWrap(true);
  });

  // A failed send is the one thing you must not scroll past.
  var teamCol = colIndex_('teamEmailStatus');
  var clientCol = colIndex_('clientEmailStatus');
  [teamCol, clientCol].forEach(function (c) {
    if (c <= 0) return;
    var cell = sheet.getRange(r, c);
    var v = String(cell.getValue());
    if (v.indexOf('Failed') === 0) {
      cell.setBackground('#F8D7DA').setFontColor('#842029');
    } else if (v === 'Sent') {
      cell.setBackground('#D9F0E3').setFontColor('#0F5132');
    }
  });

  // Tint the whole row by form type so the three streams are distinguishable.
  var typeCol = colIndex_('formType');
  if (typeCol > 0) {
    var type = String(sheet.getRange(r, typeCol).getValue());
    var tint = type === 'booking' ? '#FFF8E1' : type === 'lead' ? '#F3F6FB' : null;
    if (tint) {
      sheet.getRange(r, 1, 1, COLUMNS.length).setBackground(tint);
      // Re-apply the status colours the row tint just overwrote.
      [teamCol, clientCol].forEach(function (c) {
        if (c <= 0) return;
        var cell = sheet.getRange(r, c);
        var v = String(cell.getValue());
        if (v.indexOf('Failed') === 0) cell.setBackground('#F8D7DA');
        else if (v === 'Sent') cell.setBackground('#D9F0E3');
      });
    }
  }
}

function colIndex_(key) {
  for (var i = 0; i < COLUMNS.length; i++) {
    if (COLUMNS[i].key === key) return i + 1;
  }
  return -1;
}

/**
 * Run this once from the Apps Script editor (Run → setupSheet) to create the
 * header row and formatting before any lead arrives.
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() > 0) sheet.clear();
  setUpHeaders_(sheet);
  SpreadsheetApp.getUi().alert('Sheet ready — ' + COLUMNS.length + ' columns created.');
}

/**
 * Run this to write one fake lead and confirm the formatting looks right.
 * Delete the row afterwards.
 */
function testAppend() {
  var sheet = getOrCreateSheet_();
  var demo = {
    timestamp: '2 Sept 2026, 8:34:12 pm IST',
    formType: 'brief',
    name: 'Test Lead',
    email: 'test@example.com',
    company: 'Acme Retail',
    service: 'E-Commerce Development',
    budget: '₹10,000 – ₹25,000',
    message: 'Test row from Apps Script.',
    callSlot: '',
    estScale: 'Growth',
    estLow: '79500',
    estHigh: '95000',
    estCurrency: 'INR',
    estTimeline: 'approx. 5–8 weeks',
    estAddons: 'AI product recommendations',
    estIncluded: '1 year of Hostinger hosting · 1 year of maintenance',
    region: 'IN',
    timezone: 'Asia/Kolkata',
    source: 'Manual test',
    pageUrl: 'https://myplanetservices.com/contact',
    teamEmailStatus: 'Sent',
    clientEmailStatus: 'Sent',
    clientEmailTo: 'test@example.com',
    resendId: 'test-0000'
  };
  var values = COLUMNS.map(function (col) {
    if (col.key.indexOf('__manual') === 0) {
      return col.key === '__manual_status' ? 'New' : '';
    }
    return demo[col.key] === undefined ? '' : String(demo[col.key]);
  });
  sheet.appendRow(values);
  formatLastRow_(sheet);
}

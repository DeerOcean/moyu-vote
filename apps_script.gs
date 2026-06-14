// 摸魚比稿投票 — Google Apps Script Web App
// 收 POST(一票 append 一列) + GET(回傳全部票的 JSON 給排行用)
// 部署：擴充功能→Apps Script→貼上→部署為網頁應用程式(任何人可存取)

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('votes');
  if (!sh) {
    sh = ss.insertSheet('votes');
    sh.appendRow(['ts', 'voter', 'winner', 'loser', 'tie', 'pair']);
  }
  return sh;
}

function doPost(e) {
  try {
    var v = JSON.parse(e.postData.contents);
    _sheet().appendRow([
      new Date(v.ts || Date.now()),
      v.voter || '',
      v.winner || '',
      v.loser || '',
      v.tie ? 'TIE' : '',
      (v.pair || []).join(' | ')
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, err: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sh = _sheet();
  var rows = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    var o = { ts: new Date(r[0]).getTime(), voter: r[1], pair: String(r[5]).split(' | ') };
    if (r[4] === 'TIE') { o.tie = true; } else { o.winner = r[2]; o.loser = r[3]; }
    out.push(o);
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

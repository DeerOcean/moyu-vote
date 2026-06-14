// 摸魚比稿投票 — Google Apps Script Web App
// 收 POST：一票/一個平手/一個否決(veto) append 一列。doGet 回傳全部 JSON。
// 部署：擴充功能→Apps Script→貼上→部署為網頁應用程式(任何人可存取)

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('votes');
  if (!sh) {
    sh = ss.insertSheet('votes');
    sh.appendRow(['ts', 'voter', 'type', 'winner', 'loser', 'image', 'pair']);
  }
  return sh;
}

function doPost(e) {
  try {
    var v = JSON.parse(e.postData.contents);
    var type = v.type || (v.tie ? 'tie' : 'vote');
    _sheet().appendRow([
      new Date(v.ts || Date.now()),
      v.voter || '',
      type,
      v.winner || '',
      v.loser || '',
      v.image || '',            // for veto
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
  var rows = _sheet().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    out.push({ ts: new Date(r[0]).getTime(), voter: r[1], type: r[2], winner: r[3], loser: r[4], image: r[5], pair: String(r[6]).split(' | ') });
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

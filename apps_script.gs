// 摸魚比稿 + UGC 投稿 — Google Apps Script Web App
// POST：type=vote/tie/veto → votes 分頁；type=submission → submissions 分頁。doGet 回票 JSON。
// 部署：擴充功能→Apps Script→貼上→部署為網頁應用程式(任何人可存取)。

function _sheet(name, header) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); }
  return sh;
}

function doPost(e) {
  try {
    var v = JSON.parse(e.postData.contents);
    if (v.type === 'submission') {
      _sheet('submissions', ['ts', 'voter', 'subtype', 'text', 'status'])
        .appendRow([new Date(v.ts || Date.now()), v.voter || '', v.subtype || '', v.text || '', '']);
    } else {
      var type = v.type || (v.tie ? 'tie' : 'vote');
      _sheet('votes', ['ts', 'voter', 'type', 'winner', 'loser', 'image', 'pair'])
        .appendRow([new Date(v.ts || Date.now()), v.voter || '', type, v.winner || '', v.loser || '', v.image || '', (v.pair || []).join(' | ')]);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, err: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var rows = _sheet('votes', ['ts', 'voter', 'type', 'winner', 'loser', 'image', 'pair']).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    out.push({ ts: new Date(r[0]).getTime(), voter: r[1], type: r[2], winner: r[3], loser: r[4], image: r[5], pair: String(r[6]).split(' | ') });
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

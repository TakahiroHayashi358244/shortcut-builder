// ============================================================
// Shortcut Builder - GAS WebAPI
// ============================================================
// 【セットアップ手順】
// 1. Google スプレッドシートを新規作成
// 2. シート名を「data」に変更
// 3. A1:D1 に以下のヘッダーを入力:
//    A1: pin | B1: data | C1: updated | D1: created
// 4. 拡張機能 → Apps Script を開く
// 5. このコードを貼り付けて保存
// 6. デプロイ → 新しいデプロイ → ウェブアプリ
//    - 実行するユーザー: 自分
//    - アクセス: 全員
// 7. デプロイ後のURLをHTMLの設定画面に入力
// ============================================================

const SHEET_NAME = 'data';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function findPinRow(pin) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(pin)) return i + 1;
  }
  return -1;
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const pin = String(params.pin || '').trim();
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin))
      return jsonResponse({ success: false, error: '4桁の数字PINを指定してください' });
    if (action === 'save') return handleSave(pin, params.data);
    if (action === 'update') return handleUpdate(pin, params.data);
    if (action === 'load') return handleLoad(pin);
    if (action === 'delete') return handleDelete(pin);
    return jsonResponse({ success: false, error: '不明なアクションです' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const pin = String(e.parameter.pin || '').trim();
    if (action === 'load' && pin) return handleLoad(pin);
    return jsonResponse({ success: true, message: 'Shortcut Builder API is running' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleSave(pin, data) {
  const sheet = getSheet();
  const now = new Date().toISOString();
  const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
  const row = findPinRow(pin);
  if (row > 0) {
    return jsonResponse({ success: false, error: 'このPINは既に使用されています。別のPINを指定してください。' });
  }
  sheet.appendRow([pin, jsonData, now, now]);
  return jsonResponse({ success: true, message: '新規保存しました', isNew: true });
}

function handleUpdate(pin, data) {
  const sheet = getSheet();
  const now = new Date().toISOString();
  const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
  const row = findPinRow(pin);
  if (row < 0) {
    return jsonResponse({ success: false, error: 'このPINのデータは見つかりません' });
  }
  sheet.getRange(row, 2).setValue(jsonData);
  sheet.getRange(row, 3).setValue(now);
  return jsonResponse({ success: true, message: '更新しました', isNew: false });
}

function handleLoad(pin) {
  const sheet = getSheet();
  const row = findPinRow(pin);
  if (row < 0) return jsonResponse({ success: false, error: 'このPINのデータは見つかりません' });
  const jsonData = sheet.getRange(row, 2).getValue();
  const updated = sheet.getRange(row, 3).getValue();
  let parsed;
  try { parsed = JSON.parse(jsonData); } catch (e) { parsed = jsonData; }
  return jsonResponse({ success: true, data: parsed, updated: updated });
}

function handleDelete(pin) {
  const sheet = getSheet();
  const row = findPinRow(pin);
  if (row < 0) return jsonResponse({ success: false, error: 'このPINのデータは見つかりません' });
  sheet.deleteRow(row);
  return jsonResponse({ success: true, message: '削除しました' });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 플레이강릉 · 사장님 자료 받는 곳 (구글 Apps Script 웹 앱)
 * 사장님이 playgangneung.com/studio 에서 올린 목소리·영상·사진을
 * 구글 드라이브 '플레이강릉/01_촬영원본/가게이름/' 아래 목소리·영상·사진 폴더로 나눠 저장한다.
 *
 * 가게 코드: 스크립트 속성 SHOPS 에 {"코드":{"name":"가게이름","owner":"사장님"}} 형식으로 둔다.
 * 코드가 없는 요청은 받지 않는다(아무나 드라이브에 올리지 못하게).
 */
const ROOT_FOLDER_ID = '1tCwAwCybNDC4L9kQwi0lBRMmwiY4FwnF'; // 플레이강릉
const RAW_FOLDER_NAME = '01_촬영원본';
const KINDS = { voice: '목소리', video: '영상', photo: '사진' };

function doGet(e) { return handle_(e.parameter || {}); }
function doPost(e) {
  let p = {};
  try { p = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: '요청 형식 오류' }); }
  return handle_(p);
}

function handle_(p) {
  try {
    const shop = shops_()[String(p.code || '')];
    if (!shop) return out_({ ok: false, error: '가게 코드가 맞지 않습니다.' });
    if (p.action === 'info') return out_({ ok: true, name: shop.name, owner: shop.owner || '' });
    if (p.action === 'start') return out_(start_(shop, p));
    if (p.action === 'chunk') return out_(chunk_(p));
    if (p.action === 'done') return out_(done_(shop, p));
    return out_({ ok: false, error: '알 수 없는 요청' });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err) });
  }
}

function shops_() {
  return JSON.parse(PropertiesService.getScriptProperties().getProperty('SHOPS') || '{}');
}

function child_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function shopFolder_(shop) {
  const raw = child_(DriveApp.getFolderById(ROOT_FOLDER_ID), RAW_FOLDER_NAME);
  return child_(raw, shop.name);
}

/** 파일 하나의 이어 올리기(resumable) 창구를 연다. 창구 주소는 그 파일 하나에만 쓸 수 있다. */
function start_(shop, p) {
  const kind = KINDS[p.kind];
  if (!kind) throw new Error('파일 종류 오류');
  const folder = child_(shopFolder_(shop), kind);
  const name = String(p.name || 'file').replace(/[\\/:*?"<>|]/g, ' ').slice(0, 120);
  const res = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': p.mime || 'application/octet-stream', 'X-Upload-Content-Length': String(p.size) },
    payload: JSON.stringify({ name: name, parents: [folder.getId()], mimeType: p.mime || undefined }),
    muteHttpExceptions: true,
  });
  const loc = res.getHeaders()['Location'] || res.getHeaders()['location'];
  if (!loc) throw new Error('드라이브 창구 열기 실패: ' + res.getResponseCode());
  return { ok: true, session: loc };
}

/** 조각 하나(base64)를 받아 드라이브로 넘긴다. */
function chunk_(p) {
  if (!/^https:\/\/www\.googleapis\.com\/upload\/drive\//.test(String(p.session))) throw new Error('창구 주소 오류');
  const bytes = Utilities.base64Decode(p.data);
  const start = Number(p.start), total = Number(p.total), end = start + bytes.length - 1;
  const res = UrlFetchApp.fetch(p.session, {
    method: 'put',
    contentType: p.mime || 'application/octet-stream',
    headers: { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total },
    payload: bytes,
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  if (code === 308) return { ok: true, next: end + 1 };
  if (code === 200 || code === 201) return { ok: true, done: true, id: JSON.parse(res.getContentText()).id };
  throw new Error('조각 올리기 실패: ' + code);
}

/** 다 올린 뒤 가게정보.txt 에 이번 접수 내용을 덧붙인다. */
function done_(shop, p) {
  const folder = shopFolder_(shop);
  const stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  const lines = [
    '==== 접수 ' + stamp + ' ====',
    '가게: ' + shop.name + ' / 사장님: ' + (p.owner || shop.owner || ''),
    '가게 자랑: ' + (p.pride || ''),
    '읽은 원고: ' + (p.script || ''),
    '녹음 길이: ' + (p.voiceSec || '') + '초',
    '동의: 목소리 영상 사용 ' + (p.c1 ? '예' : '아니오') + ' / AI 목소리 복제 ' + (p.c2 ? '예' : '아니오') + ' (' + stamp + ')',
    '올린 파일:',
  ].concat((p.files || []).map(function (f) { return ' - ' + f; })).join('\n') + '\n\n';
  const it = folder.getFilesByName('가게정보.txt');
  if (it.hasNext()) { const f = it.next(); f.setContent(f.getBlob().getDataAsString() + lines); }
  else folder.createFile('가게정보.txt', lines, MimeType.PLAIN_TEXT);
  return { ok: true, folderUrl: folder.getUrl() };
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** 편집기에서 한 번 실행: 대원호 가게 코드 등록 + 드라이브 권한 승인 */
function setup() {
  const s = shops_();
  s['dwh2611'] = { name: '대원호 횟집', owner: '김성복' };
  PropertiesService.getScriptProperties().setProperty('SHOPS', JSON.stringify(s));
  shopFolder_(s['dwh2611']);
  UrlFetchApp.fetch('https://www.googleapis.com', { muteHttpExceptions: true }); // 외부 연결 권한도 함께 승인받기
  Logger.log(JSON.stringify(s));
}

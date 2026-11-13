// 예전(레플릿) 사이트가 휴대폰에 남겨 둔 오프라인 저장(서비스 워커)을 지우고 새 사이트를 보여 주기 위한 파일.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});

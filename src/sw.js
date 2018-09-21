/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉v3.6`);

  workbox.precaching.precacheAndRoute([]);

  /** Image ressources */
  let statImages = workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  });

  workbox.routing.registerRoute(/\.(?:svg|jpg|png)$/, args => {
    return statImages.handle(args);
  });

  /** document page : HTML */
  let statDocuments = workbox.strategies.staleWhileRevalidate({
    cacheName: "documents",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 3
      })
    ]
  });

  workbox.routing.registerRoute(/\.(?:html)$/, args => {
    return statDocuments.handle(args)
    
    .catch(() => {
        return caches.match('pages/offline.html');
    });
  });

  /** Static ressources : JS and CSS */
  let statAssets = workbox.strategies.staleWhileRevalidate({
    cacheName: "static-resources"
  });

  workbox.routing.registerRoute(/\.(?:js|css)$/, args => {
    return statAssets.handle(args);
  });
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

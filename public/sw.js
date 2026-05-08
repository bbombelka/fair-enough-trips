const IMAGE_CACHE = "images-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(IMAGE_CACHE).then((cache) => {
      console.log(`Sw: ${cache} opened`);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== IMAGE_CACHE) {
            console.log(`SW: clearing ${key} cache`);
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image") {
    event.respondWith(
      caches
        .open(IMAGE_CACHE)
        .then(async (cache) => {
          const cachedResponse = await cache.match(event.request);

          if (cachedResponse) {
            console.log("SW: returning cached response");
            return cachedResponse;
          }

          const fetchRequest = new Request(event.request, { mode: "cors" });

          return fetch(fetchRequest).then((response) => {
            const isImage = response.headers.has("content-type") && response.headers.get("content-type").match(/^image\//i);

            if (response.status > 0 && response.status < 400 && isImage) {
              console.log("SW: caching response");
              cache.put(event.request, response.clone());
            }

            console.log("SW: returning fetched response");
            return response;
          });
        })
        .catch((error) => {
          console.error("  Error in fetch handler:", error);

          throw error;
        }),
    );
  }
});

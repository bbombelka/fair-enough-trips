const IMAGE_CACHE = "images-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(IMAGE_CACHE).then((cache) => {
      console.log(`Sw: ${cache} opened`);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      keys.forEach((key) => {
        if (key !== IMAGE_CACHE) {
          console.log(`SW: clearing ${key} cache`);
          caches.delete(key);
        }
      })
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image") {
    caches
      .open(IMAGE_CACHE)
      .then(async (cache) => {
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          console.log("SW: returning cached response");
          return cachedResponse;
        }

        return fetch(event.request.clone()).then((response) => {
          if (response.status < 400 && response.headers.has("content-type") && response.headers.get("content-type").match(/^image\//i)) {
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
      });
  }
});

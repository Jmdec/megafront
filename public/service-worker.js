const CACHE_NAME = "my-cache-v1"; // Use a versioned cache name
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("🔨 Caching assets during install...");
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js",
        "/icons/icon-192x192.png",
      ]);
    })
  );
  self.skipWaiting(); // Force immediate activation
  console.log("✅ Service Worker installed, waiting for activation...");
});

self.addEventListener("activate", (event) => {
  console.log("🔄 Activating new service worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)) // Delete old caches
      );
    })
  );
  self.clients.claim(); // Take control immediately
  console.log(
    "✅ Service Worker activated and ready to serve the latest content."
  );
});

// Fetch event - Serve from cache or fetch from network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Serve cached response if available, else fetch from network
      return (
        cachedResponse ||
        fetch(event.request)
          .then((networkResponse) => {
            // Dynamic caching for new resources (like API responses)
            if (event.request.url.includes("/api/")) {
              // Cache API responses if needed
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback if network fails, currently no offline fallback page
            console.warn(
              "⚠️ Network request failed. No offline fallback provided."
            );
          })
      );
    })
  );
});

// Push notification event - Display notification to user
self.addEventListener("push", (event) => {
  let notificationData = "You have a new notification!"; // Default message
  if (event.data) {
    try {
      notificationData = event.data.text(); // Get push data from event
    } catch (error) {
      console.error("⚠️ Error reading push data:", error);
    }
  }

  const options = {
    body: notificationData,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png", // Badge icon
    actions: [
      {
        action: "open_url", // Action to open the website
        title: "Open Website",
        icon: "/icons/open.png", // Action icon
      },
    ],
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification("🔔 New Notification", options)
  );
  console.log("📬 Push notification displayed:", notificationData);
});

// Handle notification click - Open the URL when clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification on click
  event.waitUntil(
    clients
      .openWindow("http://localhost:3000/user") // URL to open when clicked
      .catch((err) => console.error("⚠️ Error opening window:", err))
  );
  console.log("📲 Notification clicked, opening the URL...");
});

// Monitor service worker state - Log activation
self.addEventListener("statechange", (event) => {
  const target = event.target;
  console.log("🛠️ Service Worker state changed to:", target.state);
  if (target.state === "activated") {
    console.log("✅ Service Worker is now active!");
  }
});

"use client"; // This makes sure it's only executed on the client side
import { useEffect, useState } from "react";

// The VAPID public key (replace with your own key)
const VAPID_PUBLIC_KEY = "BBXJzE_yf6OlLw14ZbeQJUz9dgh8kVRUa0pdr6KHbZ2A03y_QIKETt6lbuwYkNL3Vxw0dp0k5nDC02LkfKj0DK4";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const PushNotificationHandler = () => {
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(false);

  // Effect to register service worker and handle push subscription
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("🚫 Push notifications are not supported in this browser.");
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("✅ Service Worker registered:", registration);

        const serviceWorker = registration.installing || registration.waiting || registration.active;

        if (serviceWorker) {
          serviceWorker.addEventListener("statechange", async (event) => {
            const target = event.target as ServiceWorker;
            console.log("🛠️ Service Worker state changed to:", target.state);

            if (target.state === "activated") {
              console.log("✅ Service Worker ACTIVATED");
              setIsServiceWorkerActive(true);
              await handlePushSubscription(registration); // Proceed with subscription
            }
          });
        }

        // Check if service worker is already active and subscribe
        if (registration.active) {
          console.log("✅ Service Worker is already active");
          setIsServiceWorkerActive(true);
          await handlePushSubscription(registration); // Subscribe if already active
        }
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    };

    registerServiceWorker();
  }, []);

  // Handle push subscription logic
  const handlePushSubscription = async (registration: ServiceWorkerRegistration) => {
    if (!registration.active) {
      console.warn("🚫 Service Worker is not yet active. Retrying...");
      return;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("🚫 Notification permission denied.");
        return;
      }
    }

    if (Notification.permission === "granted") {
      await subscribeToPushNotifications(registration); // Subscribe once permissions are granted
    }
  };

  // Subscribe to push notifications if not already subscribed
  const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
    try {
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("🔄 User is already subscribed:", existingSubscription);
        return;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log("✅ New push subscription:", subscription);
      await sendSubscriptionToBackend(subscription); // Send subscription to backend
    } catch (error) {
      console.error("❌ Failed to subscribe to push notifications:", error);
    }
  };

  // Send the subscription to the backend
  const sendSubscriptionToBackend = async (subscription: PushSubscription) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/save-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      if (response.ok) {
        console.log("✅ Subscription saved to backend.");
      } else {
        console.error("❌ Failed to save subscription to backend.");
      }
    } catch (error) {
      console.error("❌ Error saving subscription:", error);
    }
  };

  // Convert the VAPID public key to Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  };

  return null; // This component doesn't render anything visible, it just handles the subscription
};

export default PushNotificationHandler;

"use client";  // This makes sure it's only executed on the client side
import { useEffect, useState } from "react";

export default function ServiceWorkerRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);  // Store the deferred prompt event
  const [showInstallButton, setShowInstallButton] = useState(false);  // Control visibility of install button

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();  // Prevent the default install prompt
      setDeferredPrompt(event);  // Save the event to trigger installation manually
      setShowInstallButton(true);  // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();  // Trigger the install prompt
      deferredPrompt.userChoice
        .then((choiceResult: any) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          setDeferredPrompt(null);  // Reset the deferred prompt
          setShowInstallButton(false);  // Hide the install button after it's clicked
        })
        .catch((error:any) => {
          console.error("Error during the installation prompt:", error);
        });
    }
  };

  return (
    <>
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition fixed bottom-4 right-4 z-50"
        >
          Install App
        </button>
      )}
    </>
  );
}

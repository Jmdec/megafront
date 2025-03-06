import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public", // Folder where service worker and other PWA assets will be saved
});
const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode for development
  images: {
    domains: ['localhost'], // Allow images from localhost (if needed for your app)
  },
  // Additional Next.js config options here if needed
};

export default withPWA(nextConfig); // Apply PWA configuration to the next.js config

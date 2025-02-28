import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public", // Folder where service worker and other PWA assets will be saved
});

const nextConfig: NextConfig = {
 
  reactStrictMode: true, 


};

export default withPWA(nextConfig); // Apply PWA configuration to the next.js config

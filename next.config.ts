import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
};
export default config;
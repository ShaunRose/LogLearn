import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native compiler caches and lockfiles separate for Windows and WSL.
  distDir: `.next-${process.platform}`,
};

export default nextConfig;

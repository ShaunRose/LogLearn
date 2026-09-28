import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    // Separate local Windows/WSL caches; keep production output compatible with Vercel.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? `.next-${process.platform}` : ".next",
  };
}

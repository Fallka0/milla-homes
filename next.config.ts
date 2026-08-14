import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https://*.supabase.co https://*.vercel.app",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // Serve images straight from source (Supabase/Unsplash) instead of routing
    // them through Vercel's image optimizer. The optimizer has a monthly
    // transformation quota that gets exhausted quickly by galleries with dozens
    // of photos, which returns 402 and breaks image loading site-wide. Supabase
    // already stores reasonably sized images and the CSP allows https sources.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Shareable property pages are built from a checked-in JSON file, so the
        // CDN can hold them and serve a buyer on 4G from the edge. Content only
        // changes on deploy, and stale-while-revalidate keeps the first request
        // after a deploy fast too.
        source: "/p/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // English is served at the bare /p/[slug]; keep a single canonical URL.
        source: "/p/:slug/en",
        destination: "/p/:slug",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: currentDirectory,
  },
};

export default nextConfig;

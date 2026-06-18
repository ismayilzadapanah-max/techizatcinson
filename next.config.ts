import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================
  // Performance optimizasiya
  // ============================================================
  compress: true,
  productionBrowserSourceMaps: false,

  // Şəkil optimizasiya
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================================
  // Security headers
  // ============================================================
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://*.vercel.live wss://*.supabase.co",
              "frame-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Cache static assets
        source:
          "/(.*\\.(?:jpg|jpeg|gif|png|webp|avif|ico|svg|woff|woff2|ttf|eot|css|js))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ============================================================
  // Redirects
  // ============================================================
  async redirects() {
    return [
      // Köhnə URL-lərin yönləndirilməsi
      { source: "/home", destination: "/", permanent: true },
      { source: "/for-businesses", destination: "/for-suppliers", permanent: true },
      { source: "/for-restaurant", destination: "/for-restaurants", permanent: true },
    ];
  },

  // ============================================================
  // Build optimization
  // ============================================================
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },

  experimental: {
    optimizePackageImports: ["@supabase/ssr"],
  },
};

export default nextConfig;

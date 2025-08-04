// Debug check voor DATABASE_URL in production
if (process.env.NODE_ENV === "production") {
  console.log("✅ DATABASE_URL in production:", process.env.DATABASE_URL ?? "⛔ NIET GEDEFINIEERD");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ✅ Essentieel voor Vercel + App Router
  serverExternalPackages: ["@prisma/client"],
  
  // Optimize for Vercel
  serverExternalPackages: ["@prisma/client"],
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['dsqdwpivbzlppfqqxkbq.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Add security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://dsqdwpivbzlppfqqxkbq.supabase.co;",
          },
        ],
      },
    ];
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

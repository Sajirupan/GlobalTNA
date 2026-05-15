/** @type {import('next').NextConfig} */
const nextConfig = {
  // In development, proxy /api/* → Express backend so CORS is avoided from the browser.
  // In production (e.g. Vercel) set NEXT_PUBLIC_API_URL to the deployed backend URL
  // and the axiosClient will use that base URL directly.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

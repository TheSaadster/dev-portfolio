/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // YouTube video thumbnails (Youtube.tsx)
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default nextConfig;

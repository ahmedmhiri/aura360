/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remote placeholder sources for the seed data. Replace with your own
    // render hosting (S3, Cloudinary, etc.) or rely on local /uploads.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Permissive fallback so images pasted into the admin (from any host)
      // render via next/image. Tighten this to your own domains for production.
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;

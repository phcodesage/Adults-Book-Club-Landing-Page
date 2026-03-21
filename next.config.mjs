/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow base64 data URLs from the media library to be used in <img> tags
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

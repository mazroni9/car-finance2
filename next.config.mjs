/** @type {import('next').NextConfig} */
// إعدادات Next.js

const nextConfig = {
  images: {
    // السماح بتحميل الصور من Unsplash
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // السماح بتحميل الصور من Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      // السماح بتحميل الصور من example.com (للبيانات التجريبية)
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default nextConfig;

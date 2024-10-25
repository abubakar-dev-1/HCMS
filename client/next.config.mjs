/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "kind-victory-5324fb6493.strapiapp.com", // Replace with your actual Strapi domain
        pathname: "/uploads/**/*",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Houd de WordPress-URL's met afsluitende slash: /projecten/, /portfolio/h1/ ...
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;

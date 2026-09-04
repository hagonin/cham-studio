/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hébergé sur Vercel : runtime Node disponible (middleware, SSR, ISR).
  // `trailingSlash` reste vrai pour matcher `localeHref()`, qui génère
  // toujours des URLs avec slash final.
  trailingSlash: true,
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/', destination: '/fr', permanent: true }];
  },
};
export default nextConfig;

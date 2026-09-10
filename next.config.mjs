/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hébergé sur Vercel : runtime Node disponible (middleware, SSR, ISR).
  // `trailingSlash` reste vrai pour matcher `localeHref()`, qui génère
  // toujours des URLs avec slash final.
  trailingSlash: true,
  reactStrictMode: true,
  async redirects() {
    // Destination avec slash final : sans lui, `trailingSlash` ajoute une
    // seconde redirection (/ → /fr → /fr/) et la racine coûte deux allers-retours.
    return [{ source: '/', destination: '/fr/', permanent: true }];
  },
};
export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hébergement OVH mutualisé : aucun runtime Node.
  // Conséquences assumées : pas de middleware, pas de SSR, pas d'ISR.
  output: 'export',
  trailingSlash: true, // OVH/Apache sert /fr/prestations/index.html
  images: {
    unoptimized: true, // pas de serveur d'images : optimisation au build
  },
  reactStrictMode: true,
};
export default nextConfig;

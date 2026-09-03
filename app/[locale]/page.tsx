import { ContactMarker } from '@/components/ContactMarker';

export default function Home() {
  // Contenu réel en Phase 4. Le marqueur est ici pour que la primitive de la
  // Phase 2 soit exercée par le build dès maintenant.
  return (
    <main>
      <h1
        style={{ fontFamily: 'var(--font-display-stack)', fontSize: 'var(--step-5)' }}
      >
        Chạm
      </h1>
      <ContactMarker label="Chạm" />
      <p>Phase 4 — offre et estimateur à composer.</p>
    </main>
  );
}

// FUENTE ÚNICA de la calificación de Trustpilot.
// Para actualizar la cifra en TODO el sitio (JSON-LD, texto visible y TrustBox)
// cambia solo estos valores con lo que muestre el perfil público:
// https://www.trustpilot.com/review/enfermerausa.com
// Y actualiza a mano la línea "Calificación en Trustpilot" de public/llms.txt (archivo estático).
// No llamar "verificadas" a las reseñas: ninguna lleva la etiqueta Verified de Trustpilot.
export const trustpilot = {
  ratingValue: 4.4,            // TrustScore del perfil (de 1 a 5)
  reviewCount: 12,             // número de reseñas del perfil
  verifiedOn: '2026-11-25',    // fecha en que se leyó del perfil público
  profileUrl: 'https://www.trustpilot.com/review/enfermerausa.com',

  // TrustBox (widget oficial) «Review Collector», tal como lo entrega el portal de Trustpilot Business.
  // El script de arranque se carga UNA vez en src/layouts/BaseLayout.astro.
  businessUnitId: '6b00c10230d26ccd32cb90f2',
  templateId: '56278e9abfbbba0bdcd568bc',
  locale: 'en-US', // tal como lo entrega Trustpilot (no se cambia a es-ES)
};

// Formato visible en español: 4,3
export const ratingEs = String(trustpilot.ratingValue).replace('.', ',');

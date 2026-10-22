import type { Metadata } from 'next';
import './globals.css';
import { RAFFLE_CONFIG } from '@/config/raffle';

export const metadata: Metadata = {
  title: `${RAFFLE_CONFIG.title} - ${RAFFLE_CONFIG.student.grade}`,
  description: `${RAFFLE_CONFIG.greeting} Premio: ${RAFFLE_CONFIG.prize.title}. Papeleta: ${RAFFLE_CONFIG.pricePerNumber}€.`,
  openGraph: {
    title: `${RAFFLE_CONFIG.title} (${RAFFLE_CONFIG.student.grade})`,
    description: `¡Ayúdame en mi viaje a Fátima del cole! Gana una ${RAFFLE_CONFIG.prize.title} por solo 3€.`,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fredoka:wght@400;600;700&family=Quicksand:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans selection:bg-school-coral selection:text-white">
        {children}
      </body>
    </html>
  );
}

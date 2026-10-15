import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Poppins } from 'next/font/google';
import './globals.css';
import './landing.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-poppins' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains' });

const title = 'Salua · Studies that follow the patient';
const description =
  'Patient-controlled medical studies. Doctors issue encrypted studies, you decide who else reads them and for how long, and every permission and reading is recorded on Solana.';

export const metadata: Metadata = {
  metadataBase: new URL('https://salua-landing.vercel.app'),
  title,
  description,
  applicationName: 'Salua',
  keywords: ['Salua', 'medical records', 'patient consent', 'Solana', 'health data', 'Superteam Argentina'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Salua',
    title,
    description,
    locale: 'en_US',
    alternateLocale: ['es_AR'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Salua_x',
    creator: '@Salua_x',
    title,
    description,
  },
};

export const viewport: Viewport = { themeColor: '#EEF1F6' };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}

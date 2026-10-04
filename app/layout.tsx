import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Salua · Tu historia clínica, bajo tu control',
  description:
    'Historia clínica digital donde el paciente decide quién la lee, por tiempo limitado y con registro de cada acceso en Solana.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}

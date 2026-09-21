import type { Metadata } from "next";
import { Inter, Outfit } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elavenza Wellness | Opening Soon',
  description: 'Our botanical sanctuary is currently under construction. Discover pure essential oils, carrier oils, and everyday wellbeing rituals soon.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://elavenza.com'),
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Elavenza Wellness | Opening Soon',
    description: 'Our botanical sanctuary is currently under construction. Pure botanical rituals for everyday living.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'Elavenza Wellness',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <body
        className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#242A24] antialiased selection:bg-[#D5E2D1] selection:text-[#1E261D]"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

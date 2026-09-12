import type { Metadata } from "next";
import { Inter, Outfit } from 'next/font/google';
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { FavouritesProvider } from '@/lib/favourites';
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import CartDrawer from "@/components/storefront/CartDrawer";

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
  title: {
    default: 'Elavenza Wellness | Botanical rituals',
    template: '%s | Elavenza',
  },
  description: 'Discover essential oils, botanical skincare and thoughtful rituals for everyday wellbeing with Elavenza Wellness.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: process.env.NEXT_PUBLIC_SITE_URL ? {index:true,follow:true} : {index:false,follow:false},
  twitter: {card:'summary_large_image'},
  keywords: ['essential oils', 'carrier oils', 'aromatherapy', 'natural wellness', 'Australia', 'pure oils', 'organic'],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Elavenza Wellness',
    images: [{url:'/images/hero-banner.jpg',alt:'Elavenza botanical wellness'}],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CartProvider><FavouritesProvider>
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
          <Footer />
          <CartDrawer />
        </FavouritesProvider></CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from 'next/font/google';
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import CartDrawer from "@/components/storefront/CartDrawer";
import ThemeSwitcher from "@/components/storefront/ThemeSwitcher";

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
    default: 'Elavenza | Pure Essential Oils Australia',
    template: '%s | Elavenza',
  },
  description: 'Premium 100% pure essential oils, carrier oils, and natural wellness products. Australian owned. Free shipping on orders over $75.',
  keywords: ['essential oils', 'carrier oils', 'aromatherapy', 'natural wellness', 'Australia', 'pure oils', 'organic'],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Elavenza',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ThemeSwitcher />
        </CartProvider>
      </body>
    </html>
  );
}

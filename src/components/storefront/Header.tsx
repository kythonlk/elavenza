'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Droplet, 
  Sparkles, 
  HeartHandshake, 
  Feather,
  Info
} from 'lucide-react';

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Essential Oils', href: '/products?category=essential-oils', icon: Droplet },
    { label: 'Carrier Oils', href: '/products?category=carrier-oils', icon: Feather },
    { label: 'Skincare', href: '/products?category=skincare', icon: Sparkles },
    { label: 'Wellbeing', href: '/products?category=wellbeing', icon: HeartHandshake },
    { label: 'Our Story', href: '/about', icon: Info },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-primary text-white text-center py-2 px-4 text-xs md:text-sm font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="hidden sm:inline">🌿 Free Australia-wide express shipping on orders over $75 | </span>
        <span>100% Pure Therapeutic Grade Botanicals</span>
      </div>

      {/* Main Header */}
      <div className="bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-22">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-text hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-all duration-300">
                <Droplet className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-heading font-bold text-primary tracking-tight block">Elavenza</span>
                <span className="text-[10px] text-text-muted tracking-widest uppercase block -mt-1 font-semibold">Botanical Wellness · Australia</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors relative group flex items-center gap-1.5 rounded-lg hover:bg-bg-alt/60"
                  >
                    <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4" />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-text-muted hover:text-primary hover:bg-bg-alt rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-2.5 text-text-muted hover:text-primary hover:bg-bg-alt rounded-full transition-colors hidden sm:flex items-center justify-center"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 text-text-muted hover:text-primary hover:bg-bg-alt rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 w-5 h-5 bg-accent text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-surface animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar (expandable) */}
      {searchOpen && (
        <div className="bg-surface border-b border-border animate-slide-down shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-text-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pure essential oils, carrier oils, skincare, diffusers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-bg-alt border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-text-light"
                />
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shrink-0">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-surface border-b border-border animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-5 space-y-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text hover:text-primary hover:bg-bg-alt rounded-xl transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <hr className="my-3 border-border" />
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-muted hover:text-primary"
            >
              <UserIcon className="w-5 h-5 text-text-muted" />
              <span>Customer Account / Sign In</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

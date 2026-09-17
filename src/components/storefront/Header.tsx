"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { Heart, Search, ShoppingBag, User, Menu, X, ArrowRight, ChevronDown, Sparkles, Star } from 'lucide-react';
import { useFavourites } from '@/lib/favourites';
import { useCart } from '@/lib/cart';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  images: string[];
  category?: { name: string; slug: string };
}

export default function Header() {
  const { items: favourites } = useFavourites();
  const { itemCount, toggleCart } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);

  // Live search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaCloseTimer = useRef<NodeJS.Timeout | null>(null);

  function handleMouseEnterMega(menu: string) {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setActiveMega(menu);
  }

  function handleMouseLeaveMega() {
    megaCloseTimer.current = setTimeout(() => {
      setActiveMega(null);
    }, 180);
  }

  // Live search debounced fetch
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setMobileMenu(false);
          setSearchOpen(false);
          setActiveMega(null);
        }
      }}
    >
      {/* Announcement Banner */}
      <div className="announcement">
        <span>A little nature. A little more you.</span>
        <Link href="/shipping">
          Free AU shipping on orders $75+ <ArrowRight size={13} />
        </Link>
      </div>

      {/* Brand Row */}
      <div className="brand-row wrap">
        <button
          className="icon-button mobile-menu"
          aria-label="Open navigation"
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <Link href="/ritual-finder" className="header-note">
          Find your everyday ritual ↗
        </Link>

        <Link href="/" aria-label="Elavenza Wellness home" className="brand-logo">
          <Image
            src="/images/elavenza-wellness-logo.png"
            alt="Elavenza Wellness"
            width={240}
            height={90}
            priority
            className="object-contain h-20 w-52"
          />
        </Link>

        <div className="header-actions">
          <Link
            className="icon-button header-favourites"
            href="/favourites"
            aria-label={`Favourites, ${favourites.length} saved products`}
          >
            <Heart size={20} />
            {favourites.length > 0 && <span>{favourites.length}</span>}
          </Link>

          <button
            className="icon-button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>

          <Link className="icon-button account-link" href="/account" aria-label="Your account">
            <User size={20} />
          </Link>

          <button
            className="icon-button cart-trigger"
            onClick={toggleCart}
            aria-label={`Open bag, ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            <span>{itemCount}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar with Mega Menus */}
      <nav
        aria-label="Main navigation"
        className={`main-nav ${mobileMenu ? 'is-open' : ''}`}
        onMouseLeave={handleMouseLeaveMega}
      >
        {/* Essential Oils (Mega Menu) */}
        <div
          className="nav-item-has-mega"
          onMouseEnter={() => handleMouseEnterMega('essential-oils')}
        >
          <Link
            href="/products?category=essential-oils"
            className={`nav-link ${activeMega === 'essential-oils' ? 'is-active' : ''}`}
            onClick={() => setMobileMenu(false)}
          >
            Essential oils <ChevronDown size={13} className="inline-block ml-0.5 opacity-70" />
          </Link>
        </div>

        {/* Carrier Oils (Mega Menu) */}
        <div
          className="nav-item-has-mega"
          onMouseEnter={() => handleMouseEnterMega('carrier-oils')}
        >
          <Link
            href="/products?category=carrier-oils"
            className={`nav-link ${activeMega === 'carrier-oils' ? 'is-active' : ''}`}
            onClick={() => setMobileMenu(false)}
          >
            Carrier oils <ChevronDown size={13} className="inline-block ml-0.5 opacity-70" />
          </Link>
        </div>

        {/* Home & Wellbeing (Mega Menu) */}
        <div
          className="nav-item-has-mega"
          onMouseEnter={() => handleMouseEnterMega('wellbeing')}
        >
          <Link
            href="/products?category=wellbeing"
            className={`nav-link ${activeMega === 'wellbeing' ? 'is-active' : ''}`}
            onClick={() => setMobileMenu(false)}
          >
            Home &amp; wellbeing <ChevronDown size={13} className="inline-block ml-0.5 opacity-70" />
          </Link>
        </div>

        {/* Standard Links */}
        <Link href="/products" onClick={() => setMobileMenu(false)}>
          Shop all
        </Link>
        <Link href="/about" onClick={() => setMobileMenu(false)}>
          Our story
        </Link>
        <Link href="/journal" onClick={() => setMobileMenu(false)}>
          The journal
        </Link>
      </nav>

      {/* ==================== MEGA MENUS (Desktop Dropdown) ==================== */}
      {activeMega && (
        <div
          className="mega-menu-portal"
          onMouseEnter={() => handleMouseEnterMega(activeMega)}
          onMouseLeave={handleMouseLeaveMega}
        >
          <div className="wrap mega-menu-inner">
            {/* 1. ESSENTIAL OILS MEGA MENU */}
            {activeMega === 'essential-oils' && (
              <div className="mega-menu-grid">
                {/* Col 1: Organic Essential Oils */}
                <div className="mega-col">
                  <div className="mega-col-header">
                    <span className="mega-badge organic">ACO ORGANIC</span>
                    <Link href="/products?category=organic-essential-oils" onClick={() => setActiveMega(null)}>
                      <h3>Organic Essential Oils</h3>
                    </Link>
                  </div>
                  <ul className="mega-link-list">
                    <li>
                      <Link href="/products/organic-lavender-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Lavender Essential Oil</span>
                        <small>$26.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-tea-tree-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Tea Tree Essential Oil</span>
                        <small>$22.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-sweet-orange-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Sweet Orange Essential Oil</span>
                        <small>$19.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-peppermint-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Peppermint Essential Oil</span>
                        <small>$24.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-rosemary-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Rosemary Essential Oil</span>
                        <small>$25.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-frankincense-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Frankincense Olibanum Essential Oil</span>
                        <small>$38.00</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Pure Essential Oils */}
                <div className="mega-col">
                  <div className="mega-col-header">
                    <span className="mega-badge pure">100% PURE</span>
                    <Link href="/products?category=pure-essential-oils" onClick={() => setActiveMega(null)}>
                      <h3>Pure Essential Oils</h3>
                    </Link>
                  </div>
                  <ul className="mega-link-list">
                    <li>
                      <Link href="/products/pure-eucalyptus-radiata-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Eucalyptus Radiata Pure Essential Oil</span>
                        <small>$16.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-lavender-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Lavender Pure Essential Oil</span>
                        <small>$18.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-tea-tree-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Tea Tree Pure Essential Oil</span>
                        <small>$16.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-sweet-orange-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Sweet Orange Pure Essential Oil</span>
                        <small>$15.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-peppermint-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Peppermint Pure Essential Oil</span>
                        <small>$17.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-rosemary-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Rosemary Pure Essential Oil</span>
                        <small>$18.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-frankincense-essential-oil" onClick={() => setActiveMega(null)}>
                        <span>Frankincense Olibanum Pure Essential Oil</span>
                        <small>$29.00</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Featured Product 1 */}
                <div className="mega-col-card">
                  <Link
                    href="/products/organic-lavender-essential-oil"
                    className="mega-card"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-card-image">
                      <Image
                        src="/images/products/organic-lavender-essential-oil.jpg"
                        alt="Organic Lavender"
                        fill
                        className="object-cover"
                      />
                      <span className="card-pill">BESTSELLER</span>
                    </div>
                    <div className="mega-card-body">
                      <h4>Lavender Essential Oil</h4>
                      <p>Certified Organic · Deep sleep &amp; calming</p>
                      <strong>$26.00 AUD</strong>
                    </div>
                  </Link>
                </div>

                {/* Col 4: Featured Product 2 */}
                <div className="mega-col-card">
                  <Link
                    href="/products/pure-eucalyptus-radiata-essential-oil"
                    className="mega-card"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-card-image">
                      <Image
                        src="/images/products/pure-eucalyptus-radiata-essential-oil.jpg"
                        alt="Eucalyptus Radiata"
                        fill
                        className="object-cover"
                      />
                      <span className="card-pill native">AU NATIVE</span>
                    </div>
                    <div className="mega-card-body">
                      <h4>Eucalyptus Radiata Pure Essential Oil</h4>
                      <p>Clear respiration &amp; refreshing Australian bush</p>
                      <strong>$16.00 AUD</strong>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* 2. CARRIER OILS MEGA MENU */}
            {activeMega === 'carrier-oils' && (
              <div className="mega-menu-grid">
                {/* Col 1: Organic Carrier Oils */}
                <div className="mega-col">
                  <div className="mega-col-header">
                    <span className="mega-badge organic">ACO ORGANIC</span>
                    <Link href="/products?category=organic-carrier-oils" onClick={() => setActiveMega(null)}>
                      <h3>Organic Carrier Oils</h3>
                    </Link>
                  </div>
                  <ul className="mega-link-list">
                    <li>
                      <Link href="/products/organic-golden-jojoba-oil" onClick={() => setActiveMega(null)}>
                        <span>Golden Jojoba Oil</span>
                        <small>$29.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-rosehip-oil" onClick={() => setActiveMega(null)}>
                        <span>Rosehip Seed Oil</span>
                        <small>$32.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-sweet-almond-oil" onClick={() => setActiveMega(null)}>
                        <span>Sweet Almond Oil</span>
                        <small>$22.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-argan-oil" onClick={() => setActiveMega(null)}>
                        <span>Moroccan Argan Oil</span>
                        <small>$34.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-refined-macadamia-oil" onClick={() => setActiveMega(null)}>
                        <span>Refined Macadamia Oil</span>
                        <small>$24.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/organic-refined-apricot-kernel-oil" onClick={() => setActiveMega(null)}>
                        <span>Refined Apricot Kernel Oil</span>
                        <small>$22.00</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Pure Carrier Oils */}
                <div className="mega-col">
                  <div className="mega-col-header">
                    <span className="mega-badge pure">100% PURE</span>
                    <Link href="/products?category=pure-carrier-oils" onClick={() => setActiveMega(null)}>
                      <h3>Pure Carrier Oils</h3>
                    </Link>
                  </div>
                  <ul className="mega-link-list">
                    <li>
                      <Link href="/products/pure-golden-jojoba-oil" onClick={() => setActiveMega(null)}>
                        <span>Golden Jojoba Pure Carrier Oil</span>
                        <small>$22.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-rosehip-oil" onClick={() => setActiveMega(null)}>
                        <span>Rosehip Seed Pure Carrier Oil</span>
                        <small>$24.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-sweet-almond-oil" onClick={() => setActiveMega(null)}>
                        <span>Sweet Almond Pure Carrier Oil</span>
                        <small>$16.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-fractionated-coconut-oil" onClick={() => setActiveMega(null)}>
                        <span>Fractionated Coconut Pure Carrier Oil</span>
                        <small>$18.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-refined-macadamia-oil" onClick={() => setActiveMega(null)}>
                        <span>Refined Macadamia Pure Carrier Oil</span>
                        <small>$18.00</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products/pure-refined-apricot-kernel-oil" onClick={() => setActiveMega(null)}>
                        <span>Refined Apricot Kernel Pure Carrier Oil</span>
                        <small>$17.00</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Featured Jojoba */}
                <div className="mega-col-card">
                  <Link
                    href="/products/organic-golden-jojoba-oil"
                    className="mega-card"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-card-image">
                      <Image
                        src="/images/products/organic-golden-jojoba-oil.jpg"
                        alt="Golden Jojoba"
                        fill
                        className="object-cover"
                      />
                      <span className="card-pill">FAVOURITE</span>
                    </div>
                    <div className="mega-card-body">
                      <h4>Golden Jojoba Oil</h4>
                      <p>Certified Organic · Weightless facial &amp; body moisture</p>
                      <strong>$29.00 AUD</strong>
                    </div>
                  </Link>
                </div>

                {/* Col 4: Featured Rosehip */}
                <div className="mega-col-card">
                  <Link
                    href="/products/organic-rosehip-oil"
                    className="mega-card"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-card-image">
                      <Image
                        src="/images/products/organic-rosehip-oil.jpg"
                        alt="Rosehip Seed"
                        fill
                        className="object-cover"
                      />
                      <span className="card-pill">VITAMIN A</span>
                    </div>
                    <div className="mega-card-body">
                      <h4>Rosehip Seed Oil</h4>
                      <p>Certified Organic · Radiant cellular renewal</p>
                      <strong>$32.00 AUD</strong>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* 3. HOME & WELLBEING MEGA MENU */}
            {activeMega === 'wellbeing' && (
              <div className="mega-menu-grid wellbeing-grid">
                {/* Col 1 & 2: Diffuser Showcase */}
                <div className="mega-diffuser-showcase">
                  <div className="diffuser-image-col">
                    <Image
                      src="/images/prod-diffuser.jpg"
                      alt="Ceramic Aroma Diffuser"
                      width={280}
                      height={280}
                      className="object-cover rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="diffuser-info-col">
                    <span className="mega-badge device">RITUAL ESSENTIAL</span>
                    <h3>Ceramic Ultrasonic Aroma Diffuser</h3>
                    <p>
                      Handcrafted artisan matte white ceramic with cool 2.4MHz misting technology.
                      Preserves the delicate botanical integrity of your essential oils.
                    </p>
                    <ul className="diffuser-features">
                      <li>• 300ml water capacity (up to 10h runtime)</li>
                      <li>• Ambient warm LED glow night light</li>
                      <li>• Automatic waterless shut-off</li>
                    </ul>
                    <div className="diffuser-action">
                      <span className="price">$65.00 AUD</span>
                      <Link
                        href="/products/ceramic-ultrasonic-aroma-diffuser"
                        className="button small"
                        onClick={() => setActiveMega(null)}
                      >
                        Explore Diffuser <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Col 3: Ritual Finder Tool */}
                <div className="mega-col-tool">
                  <div className="tool-card">
                    <Sparkles className="tool-icon" size={24} />
                    <h4>Find Your Everyday Ritual</h4>
                    <p>Answer 3 quick questions to discover your personalized essential oil blend.</p>
                    <Link
                      href="/ritual-finder"
                      className="text-link"
                      onClick={() => setActiveMega(null)}
                    >
                      Start Ritual Finder ↗
                    </Link>
                  </div>

                  <div className="tool-card mt-4">
                    <h4>The Botanical Journal</h4>
                    <p>Insights into aromatherapy, sleep hygiene, and carrier blending.</p>
                    <Link
                      href="/journal"
                      className="text-link"
                      onClick={() => setActiveMega(null)}
                    >
                      Read the Journal ↗
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Mega Menu Footer Banner */}
            <div className="mega-menu-footer">
              <Link
                href={
                  activeMega === 'essential-oils'
                    ? '/products?category=essential-oils'
                    : activeMega === 'carrier-oils'
                    ? '/products?category=carrier-oils'
                    : '/products?category=wellbeing'
                }
                className="mega-footer-link"
                onClick={() => setActiveMega(null)}
              >
                <span>
                  Explore all{' '}
                  {activeMega === 'essential-oils'
                    ? '13 Essential Oils'
                    : activeMega === 'carrier-oils'
                    ? '12 Carrier Oils'
                    : 'Aromatherapy & Wellbeing'}
                </span>
                <ArrowRight size={14} />
              </Link>
              <span className="mega-footer-note">Free standard Australian shipping on orders $75+</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE SEARCH PANEL WITH LIVE AUTOCOMPLETE ==================== */}
      {searchOpen && (
        <div className="search-panel-wrap">
          <div className="wrap">
            <form
              className="search-panel"
              action="/products"
              onSubmit={(e) => {
                if (!searchQuery.trim()) e.preventDefault();
              }}
            >
              <Search className="search-input-icon" size={20} />
              <label className="sr-only" htmlFor="header-search">
                Search products
              </label>
              <input
                id="header-search"
                ref={searchInputRef}
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search essential oils, carrier oils, diffusers, ingredients..."
                autoFocus
                required
              />
              <button className="button" type="submit">
                Search <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X />
              </button>
            </form>

            {/* Live Autocomplete Results Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="search-autocomplete-dropdown">
                <div className="search-autocomplete-header">
                  <span>
                    {isSearching
                      ? 'Searching the botanical apothecary...'
                      : searchResults.length > 0
                      ? `Found ${searchResults.length} matching products:`
                      : `No products matching "${searchQuery}"`}
                  </span>
                  {searchResults.length > 0 && (
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      className="text-link"
                      onClick={() => setSearchOpen(false)}
                    >
                      View all results ↗
                    </Link>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="search-results-grid">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        className="search-result-item"
                        onClick={() => setSearchOpen(false)}
                      >
                        <div className="search-result-img">
                          <Image
                            src={prod.images?.[0] || '/images/prod-lavender.jpg'}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="search-result-meta">
                          <span className="search-result-cat">{prod.category?.name || 'Botanical'}</span>
                          <strong className="search-result-title">{prod.name}</strong>
                          <span className="search-result-price">${prod.price.toFixed(2)} AUD</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

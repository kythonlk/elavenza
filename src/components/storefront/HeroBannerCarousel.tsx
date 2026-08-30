'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Sparkles, Droplet } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: { icon: Leaf, text: '100% Pure · Melbourne' },
    headline: 'Pure Botanicals for',
    headlineAccent: 'Everyday Living',
    sub: 'Experience Australia\'s finest single essential oils, virgin cold-pressed carrier oils, restorative botanical skincare, and ultrasonic diffusers.',
    cta: { label: 'Explore Collection', href: '/products' },
    ctaSecondary: { label: 'Essential Oils', href: '/products?category=essential-oils' },
    image: '/images/hero-banner.jpg',
    imageAlt: 'Elavenza Pure Australian Essential Oils',
    accentColor: 'var(--color-primary)',
    stats: [
      { value: '100% Pure', sub: 'GC/MS Lab Tested' },
      { value: 'Free Express', sub: 'AU Orders Over $75' },
      { value: 'Ethical', sub: 'Cruelty-Free & Vegan' },
    ],
  },
  {
    id: 2,
    badge: { icon: Droplet, text: 'Single-Origin Oils' },
    headline: 'Artisanal Carrier Oils',
    headlineAccent: 'Cold-Pressed Pure',
    sub: 'Rich, nourishing carrier oils—from golden jojoba to sweet almond—perfect for blending, massage, and skincare rituals.',
    cta: { label: 'Shop Carrier Oils', href: '/products?category=carrier-oils' },
    ctaSecondary: { label: 'Learn More', href: '/about' },
    image: '/images/cat-carrier-oils.jpg',
    imageAlt: 'Cold-Pressed Carrier Oils',
    accentColor: 'var(--color-accent)',
    stats: [
      { value: 'Unrefined', sub: 'Cold-Pressed Process' },
      { value: 'Non-GMO', sub: 'Sustainably Sourced' },
      { value: 'Amber Glass', sub: 'UV Protected' },
    ],
  },
  {
    id: 3,
    badge: { icon: Sparkles, text: 'Botanical Skincare' },
    headline: 'Restorative Serums',
    headlineAccent: 'For Radiant Skin',
    sub: 'Handcrafted with native Australian botanicals and powerful actives. No fillers, no synthetics—just pure plant intelligence for your skin.',
    cta: { label: 'Shop Skincare', href: '/products?category=skincare' },
    ctaSecondary: { label: 'Our Story', href: '/about' },
    image: '/images/cat-skincare.jpg',
    imageAlt: 'Botanical Skincare Collection',
    accentColor: 'var(--color-secondary)',
    stats: [
      { value: 'Native', sub: 'Australian Botanicals' },
      { value: 'No Fillers', sub: 'Synthetic-Free Formula' },
      { value: 'Small Batch', sub: 'Artisan Crafted' },
    ],
  },
];

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'right') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 'right');
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'left');
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden border-b border-border" style={{ background: 'var(--color-bg-alt)' }}>
      {/* ── Desktop Layout ── */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 z-10"
              style={{
                animation: `${direction === 'right' ? 'slideInLeft' : 'slideInRight'} 0.5s ease-out`,
              }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
                <slide.badge.icon className="w-3.5 h-3.5" />
                <span>{slide.badge.text}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.12] tracking-tight" style={{ color: 'var(--color-text)' }}>
                {slide.headline}{' '}
                <span className="italic" style={{ color: 'var(--color-primary)' }}>{slide.headlineAccent}</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                {slide.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={slide.cta.href}
                  className="inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-xl font-medium hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20 text-sm">
                  <span>{slide.cta.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={slide.ctaSecondary.href}
                  className="inline-flex items-center gap-2 border-2 border-primary/30 px-6 py-3.5 rounded-xl font-medium hover:border-primary hover:text-primary transition-all text-sm"
                  style={{ color: 'var(--color-text)', background: 'var(--color-surface)' }}>
                  <span>{slide.ctaSecondary.label}</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 pt-8 border-t grid grid-cols-3 gap-4" style={{ borderColor: 'var(--color-border)' }}>
                {slide.stats.map((s, i) => (
                  <div key={i}>
                    <p className="font-heading font-bold text-lg" style={{ color: 'var(--color-primary)' }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="lg:col-span-6 relative"
              style={{ animation: `${direction === 'right' ? 'slideInRight' : 'slideInLeft'} 0.5s ease-out` }}
            >
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl" style={{ border: '4px solid var(--color-surface)' }}>
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={current === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Slide indicator chips on image */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i, i > current ? 'right' : 'left')}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: i === current ? '24px' : '8px',
                        height: '8px',
                        background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Prev / Next arrows */}
              <button onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
                aria-label="Previous slide">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
                aria-label="Next slide">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Layout — full-bleed card carousel ── */}
      <div className="md:hidden relative">
        {/* Full bleed image */}
        <div className="relative w-full h-[62vh] min-h-[380px]">
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient overlay — heavy at bottom for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Top badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase">
              <slide.badge.icon className="w-3 h-3" />
              <span>{slide.badge.text}</span>
            </div>
            {/* Dot indicators */}
            <div className="flex gap-1.5 pr-1">
              {slides.map((_, i) => (
                <button key={i} onClick={() => goTo(i, i > current ? 'right' : 'left')}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '20px' : '6px',
                    height: '6px',
                    background: i === current ? 'white' : 'rgba(255,255,255,0.45)',
                  }}
                  aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>

          {/* Bottom copy — overlaid on image */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
            <h1 className="text-[28px] font-heading font-bold text-white leading-[1.15] tracking-tight">
              {slide.headline}{' '}
              <span style={{ color: 'var(--color-accent-light)' }}>{slide.headlineAccent}</span>
            </h1>
            <p className="mt-2 text-[13px] text-white/80 leading-snug line-clamp-2">{slide.sub}</p>

            {/* CTA buttons */}
            <div className="mt-4 flex gap-2.5">
              <Link href={slide.cta.href}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white py-3 rounded-2xl font-semibold text-[13px] hover:bg-primary-dark transition-colors">
                <span>{slide.cta.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href={slide.ctaSecondary.href}
                className="inline-flex items-center justify-center px-4 py-3 rounded-2xl font-semibold text-[13px] transition-colors"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
                {slide.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip below image */}
        <div className="flex divide-x divide-border" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          {slide.stats.map((s, i) => (
            <div key={i} className="flex-1 py-3 px-2 text-center">
              <p className="font-heading font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Swipe arrows (mobile) */}
        <button onClick={prev} aria-label="Previous"
          className="absolute left-2 top-[30%] -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: 'white' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} aria-label="Next"
          className="absolute right-2 top-[30%] -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: 'white' }}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

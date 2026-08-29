// ✅ SERVER COMPONENT — zero client JS, instant SSR, cached data
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/storefront/ProductCard';
import NewsletterForm from '@/components/storefront/NewsletterForm';
import { getCachedFeaturedProducts, getCachedCategories } from '@/lib/cache';
import type { Metadata } from 'next';
import {
  Droplet,
  Feather,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Award,
  Leaf,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Elavenza | Pure Essential Oils Australia',
  description: 'Premium 100% pure essential oils, carrier oils, and natural wellness products. Australian owned. Free shipping on orders over $75.',
};

// Revalidate every 60s — ISR
export const revalidate = 60;

const categoryIcons: Record<string, React.ElementType> = {
  'essential-oils': Droplet,
  'carrier-oils': Feather,
  skincare: Sparkles,
  wellbeing: HeartHandshake,
};

const categoryImages: Record<string, string> = {
  'essential-oils': '/images/cat-essential-oils.jpg',
  'carrier-oils': '/images/cat-carrier-oils.jpg',
  skincare: '/images/cat-skincare.jpg',
  wellbeing: '/images/cat-wellbeing.jpg',
};

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Essential Oils', slug: 'essential-oils', description: '100% Pure Single Oils', product_count: 3 },
  { id: 2, name: 'Carrier Oils', slug: 'carrier-oils', description: 'Cold-Pressed Nut & Seed Oils', product_count: 2 },
  { id: 3, name: 'Skincare', slug: 'skincare', description: 'Restorative Serums & Elixirs', product_count: 2 },
  { id: 4, name: 'Wellbeing', slug: 'wellbeing', description: 'Ultrasonic Ceramic Diffusers', product_count: 1 },
];

export default async function HomePage() {
  // Parallel fetch — both resolve in one server-side round-trip, cached
  const [featured, categories] = await Promise.all([
    getCachedFeaturedProducts(8),
    getCachedCategories(),
  ]);

  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-bg-alt overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 animate-fade-in z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
                <Leaf className="w-3.5 h-3.5" />
                <span>100% Pure Therapeutic Grade · Melbourne</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text leading-[1.12] tracking-tight">
                Pure Botanicals for{' '}
                <span className="text-primary italic">Everyday Living</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
                Experience Australia&apos;s finest collection of single essential oils, virgin
                cold-pressed carrier oils, restorative botanical skincare, and ultrasonic diffusers.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  prefetch={true}
                  className="inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-xl font-medium hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20 text-sm"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=essential-oils"
                  prefetch={true}
                  className="inline-flex items-center gap-2 border-2 border-primary/30 text-text px-6 py-3.5 rounded-xl font-medium hover:border-primary hover:text-primary transition-all text-sm bg-surface"
                >
                  <span>Essential Oils</span>
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-border grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="font-heading font-bold text-lg text-primary">100% Pure</p>
                  <p className="text-xs text-text-muted mt-0.5">GC/MS Lab Tested</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-primary">Free Express</p>
                  <p className="text-xs text-text-muted mt-0.5">AU Orders Over $75</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg text-primary">Ethical</p>
                  <p className="text-xs text-text-muted mt-0.5">Cruelty-Free & Vegan</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative animate-slide-up">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-surface">
                <Image
                  src="/images/hero-banner.jpg"
                  alt="Elavenza Pure Australian Essential Oils"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 bg-surface/90 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">Therapeutic Quality Guarantee</p>
                      <p className="text-[11px] text-text-muted">
                        Unadulterated native Australian &amp; world botanicals
                      </p>
                    </div>
                  </div>
                  <Link href="/about" className="text-xs font-semibold text-primary hover:underline hidden sm:block">
                    Learn more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-accent text-xs font-bold tracking-widest uppercase block">
                Core Collections
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-text">
                Shop by Category
              </h2>
            </div>
            <p className="mt-2 md:mt-0 text-sm text-text-muted max-w-md">
              Start your journey with our four foundational botanical collections crafted for mind,
              body, and home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map(cat => {
              const Icon = categoryIcons[cat.slug] || Droplet;
              const imgSrc = categoryImages[cat.slug] || '/images/cat-essential-oils.jpg';
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  prefetch={true}
                  className="group relative rounded-3xl overflow-hidden bg-bg-alt border border-border hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col aspect-[4/5]"
                >
                  <div className="relative flex-1 w-full overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-accent transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-white/80 text-xs mt-1 line-clamp-1">{cat.description}</p>
                    <span className="text-[11px] font-semibold text-accent mt-2 inline-block">
                      {cat.product_count} Products
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-16 md:py-24 bg-bg-alt/60 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-accent text-xs font-bold tracking-widest uppercase">
                Therapeutic Grade
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-text">
                Popular Bestsellers
              </h2>
            </div>
            <Link
              href="/products"
              prefetch={true}
              className="hidden md:inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Values ── */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-bg-alt">
                <Image
                  src="/images/cat-skincare.jpg"
                  alt="Artisanal Australian Skincare and Essential Oils"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="lg:col-span-6">
              <span className="text-accent text-xs font-bold tracking-widest uppercase">
                The Elavenza Standard
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-text leading-tight">
                Authentic Botanicals, <br />
                <span className="text-primary italic">Zero Compromises.</span>
              </h2>
              <p className="mt-5 text-text-muted text-sm sm:text-base leading-relaxed">
                Founded in Melbourne, Elavenza was born out of a desire for authentic, lab-tested
                essential oils and pure plant botanicals. Every batch is rigorously GC/MS tested to
                ensure maximum therapeutic potency and freedom from synthetic fragrances or mineral
                oils.
              </p>
              <div className="mt-6 space-y-3.5">
                {[
                  '100% Pure, single-origin distillation without dilution',
                  'Sustainably harvested native Australian & international botanicals',
                  'Amber UV-filtering glassware for maximum active shelf life',
                  'Proudly independent, cruelty-free, and Australian made',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-text">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-secondary text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors shadow-md"
                >
                  <span>Our Sourcing &amp; Testing Process</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── (client island) */}
      <NewsletterForm />
    </div>
  );
}

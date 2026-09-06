import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Leaf, Award, Heart, ShieldCheck, ArrowRight, Sparkles, Droplet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Philosophy | Elavenza Botanical Apothecary Australia',
  description: 'Born in Melbourne, Elavenza crafts pure, GC/MS lab-tested essential oils and restorative botanical wellness products rooted in Australian native plant wisdom.',
};

export default function AboutPage() {
  return (
    <div className="bg-bg text-text">
      {/* Editorial Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-border bg-bg-alt/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase bg-secondary-soft px-3.5 py-1.5 rounded-full inline-block mb-4">
            The Elavenza Atelier · Melbourne
          </span>
          <h1 className="text-4xl sm:text-6xl font-heading font-bold text-text tracking-tight leading-[1.15]">
            Bridging Ancient Botanical Wisdom with Modern Purity
          </h1>
          <p className="mt-6 text-base sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
            We curate and distill nature&apos;s most potent botanical essences to nurture emotional equilibrium,
            skin vitality, and serene living spaces.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-surface">
                <Image
                  src="/images/cat-essential-oils.jpg"
                  alt="Aromatherapy laboratory in Melbourne"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-heading font-bold text-lg">Melbourne Handcrafted Small Batches</p>
                  <p className="text-xs text-white/80 mt-0.5">Tested for GC/MS botanical purity</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-secondary text-xs font-bold tracking-widest uppercase block mb-2">
                Our Genesis
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text leading-tight mb-6">
                Rooted in Authenticity, <br />
                <span className="text-primary italic">Never Diluted.</span>
              </h2>
              <div className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  Elavenza began with a singular conviction: genuine aromatherapy is a profound therapeutic medicine, yet the modern market has become inundated with synthetic fragrances, standardized dilutions, and hidden carrier extenders.
                </p>
                <p>
                  Drawing inspiration from Australia&apos;s rich, rugged botanicals—from wild Blue Mallee eucalyptus groves to coastal tea tree plantations and sub-alpine lavender farms—we created an independent apothecary dedicated to uncompromised botanical integrity.
                </p>
                <p>
                  Every harvest is distilled using gentle, low-temperature steam extraction or cold expeller pressing, preserving volatile aromatic terpenes and phytonutrients in their pristine native balance.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div>
                  <p className="text-3xl font-heading font-bold text-primary">100%</p>
                  <p className="text-xs text-text-muted mt-1">Single-Origin Pure Distillates</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-bold text-secondary">0%</p>
                  <p className="text-xs text-text-muted mt-1">Fillers, Phthalates or Synthetics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Craftsmanship Standards */}
      <section className="py-20 md:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary text-xs font-bold tracking-widest uppercase">
              The Elavenza Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text mt-2">
              Our Unwavering Principles
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-bg rounded-3xl border border-border p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text mb-3">Sustainable Wildcrafting</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                We partner with generational family estates and Australian growers committed to regenerative agriculture, chemical-free soils, and ethical harvesting cycles.
              </p>
            </div>

            <div className="bg-bg rounded-3xl border border-border p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-secondary-soft text-secondary flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text mb-3">GC/MS Batch Precision</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Nothing enters our bottles without passing rigorous Gas Chromatography Mass Spectrometry testing. We verify every therapeutic compound and provide full transparency.
              </p>
              <Link href="/certifications" className="text-secondary font-semibold text-xs mt-4 inline-flex items-center gap-1 hover:underline">
                <span>View Certifications &amp; Standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-bg rounded-3xl border border-border p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent-dark flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-text mb-3">UV Amber Preservation</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Essential oils are delicate, light-sensitive bio-compounds. We package exclusively in heavy European pharmaceutical amber glass to block UV radiation and prolong shelf vitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Packaging & Dispatch */}
      <section className="py-20 md:py-24 bg-bg-alt/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary text-xs font-bold tracking-widest uppercase">Ecological Stewardship</span>
          <h2 className="text-3xl font-heading font-bold text-text mt-2 mb-4">
            Conscious Packaging for a Flourishing Planet
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            From dissolvable plant-starch packing chips to unbleached FSC-certified cartons and infinitely recyclable glass, our packaging leaves zero footprint behind.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shipping"
              className="bg-primary text-white px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Shipping &amp; Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/returns"
              className="bg-surface border border-border text-text px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-bg-alt transition-colors inline-flex items-center gap-2"
            >
              <span>30-Day Pure Serenity Guarantee</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Award, Leaf, FileCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Certifications & Quality Standards | Elavenza Pure Botanicals',
  description: 'Explore Elavenza rigorous purity benchmarks: GC/MS batch lab analysis, ISO 22716 GMP certified cleanroom bottling, COSMOS Natural adherence, and cruelty-free ethics.',
};

export default function CertificationsPage() {
  return (
    <div className="bg-bg py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase bg-secondary-soft px-3 py-1 rounded-full inline-block mb-3">
            Therapeutic Integrity
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-text tracking-tight">
            Purity Standards &amp; Certifications
          </h1>
          <p className="mt-4 text-text-muted text-base md:text-lg leading-relaxed">
            Authentic aromatherapy is both an ancient craft and an uncompromising science.
            Every distillation that enters an Elavenza bottle must pass exhaustive chromatographic
            testing, sustainable wildcrafted certification, and pharmaceutical-grade GMP protocol.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Pillar 1: GC/MS */}
          <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Laboratory Verification</span>
            <h2 className="text-2xl font-heading font-bold text-text mt-1 mb-3">
              GC/MS Batch Analysis
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Gas Chromatography / Mass Spectrometry (GC/MS) separates an essential oil into its individual constituent molecules. This acts as an unalterable biochemical fingerprint verifying 100% botanical authenticity.
            </p>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Confirms absence of synthetic fragrance, phthalates, or extenders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Verifies therapeutic active levels (e.g. Terpinen-4-ol in Tea Tree, Linalool in Lavender)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Batch Certificate of Analysis retained for every production run</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: ISO GMP */}
          <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm hover:border-secondary/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-secondary-soft text-secondary flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">Certified Manufacturing</span>
            <h2 className="text-2xl font-heading font-bold text-text mt-1 mb-3">
              ISO 22716:2007 (GMP)
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Our partner facilities adhere strictly to ISO 22716 Good Manufacturing Practice standards for cosmetic and aromatherapy manufacturing. Bottling occurs in HEPA-filtered cleanrooms in Melbourne, Victoria.
            </p>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                <span>Temperature and humidity-controlled formulation chambers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                <span>Automated nitrogen flushing during sealing to prevent oxidation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                <span>Full batch traceability back to the harvesting farm and distillation still</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: COSMOS Natural */}
          <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm hover:border-accent/60 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent-dark flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-accent-dark tracking-widest uppercase">Organic Standards</span>
            <h2 className="text-2xl font-heading font-bold text-text mt-1 mb-3">
              COSMOS Natural &amp; Organic Principles
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              In accordance with international COSMOS benchmarks, our cold-pressed carrier oils and skincare elixirs utilize certified organic botanical ingredients cultivated without synthetic herbicides, pesticides, or GMOs.
            </p>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-dark shrink-0" />
                <span>Virgin cold-pressing processes that preserve delicate essential fatty acids</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-dark shrink-0" />
                <span>Zero mineral oils, parabens, silicones, petrochemicals, or sulfates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-dark shrink-0" />
                <span>Biodegradable formulas safe for waterways and aquatic biomes</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Ethical & Cruelty Free */}
          <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Compassionate Ethics</span>
            <h2 className="text-2xl font-heading font-bold text-text mt-1 mb-3">
              100% Vegan &amp; Cruelty-Free
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              We believe true wellness must honor all living beings and the ecosystems from which our botanicals thrive. No Elavenza product or raw ingredient has ever been, or will ever be, tested on animals.
            </p>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cruelty-free sourcing audit throughout supply chains</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Plant-derived, vegan formulations without beeswax or animal lanolin</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supporting sustainable smallholder indigenous harvest co-ops</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Certificate Sample Callout */}
        <div className="bg-surface rounded-3xl border border-border p-8 md:p-12 mb-16 shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase mb-1 block">Transparency Protocol</span>
            <h3 className="text-2xl font-heading font-bold text-text mb-3">
              Want to see the GC/MS analysis of your bottle?
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Every Elavenza bottle is stamped with an individual batch code on its base. If you wish to review the laboratory certificate of analysis for your specific bottle, our Melbourne lab will provide the full chromatographic report within 24 hours.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end w-full">
            <a
              href="mailto:quality@elavenza.com.au?subject=GC/MS%20Batch%20Report%20Request"
              className="w-full sm:w-auto text-center bg-primary text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-primary-dark transition-colors shadow-sm"
            >
              Request Batch Report
            </a>
          </div>
        </div>

        {/* Bottom Navigation Link */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
          >
            <span>Explore Certified Therapeutic Botanicals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

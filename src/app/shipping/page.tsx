import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Guide | Elavenza Pure Botanicals Australia',
  description: 'Learn about Elavenza shipping options across Australia and worldwide. Free Express shipping over $75, temperature-controlled dispatch, and sustainable packaging.',
};

export default function ShippingPage() {
  return (
    <div className="bg-bg py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase bg-secondary-soft px-3 py-1 rounded-full inline-block mb-3">
            Mindful Dispatch &amp; Care
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-text tracking-tight">
            Shipping &amp; Delivery
          </h1>
          <p className="mt-4 text-text-muted text-base md:text-lg leading-relaxed">
            Every bottle is hand-poured in small batches in Melbourne, sealed in UV-protective amber glass,
            and packaged with 100% biodegradable and recyclable materials.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text">Free AU Shipping</h3>
            <p className="text-sm text-text-muted mt-2">
              Enjoy complimentary standard road delivery across Australia for all retail orders over $75 AUD.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-secondary-soft text-secondary flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text">24h Dispatch</h3>
            <p className="text-sm text-text-muted mt-2">
              Orders placed before 1:00 PM AEST on business days leave our Melbourne apothecary lab the very same day.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center mb-4">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text">Zero Plastic Packaging</h3>
            <p className="text-sm text-text-muted mt-2">
              FSC-certified unbleached corrugated boxes padded with cornstarch bio-fill that dissolves instantly in water.
            </p>
          </div>
        </div>

        {/* Detailed Shipping Rates Table */}
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-xs mb-16">
          <div className="p-6 md:p-8 border-b border-border bg-bg-alt/40">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-text">
              Australian Domestic Shipping Rates
            </h2>
            <p className="text-sm text-text-muted mt-1">
              We partner with Australia Post eParcel to guarantee nationwide tracking from dispatch to your doorstep.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-alt/20 text-xs uppercase font-bold text-text-muted border-b border-border">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Order Value</th>
                  <th className="py-4 px-6">Estimated Delivery</th>
                  <th className="py-4 px-6">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-text">Standard Road eParcel</td>
                  <td className="py-4 px-6 text-text-muted">Over $75 AUD</td>
                  <td className="py-4 px-6 text-text">2 – 5 Business Days</td>
                  <td className="py-4 px-6 font-bold text-success">FREE</td>
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-text">Standard Road eParcel</td>
                  <td className="py-4 px-6 text-text-muted">Under $75 AUD</td>
                  <td className="py-4 px-6 text-text">2 – 5 Business Days</td>
                  <td className="py-4 px-6 font-semibold text-text">$9.95 AUD</td>
                </tr>
                <tr className="hover:bg-bg-alt/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-text">Express Post eParcel</td>
                  <td className="py-4 px-6 text-text-muted">All orders</td>
                  <td className="py-4 px-6 text-text">1 – 2 Business Days (Metro)</td>
                  <td className="py-4 px-6 font-semibold text-text">$14.95 AUD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* International & Dangerous Goods Policy */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-surface rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text">International Shipping</h3>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              We dispatch internationally to New Zealand, Singapore, the United Kingdom, and the United States via DHL Express and Australia Post International.
            </p>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">
              International rates are calculated automatically at checkout based on weight and destination. Customers are responsible for any local import duties or taxes levied upon arrival.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text">Botanical Care &amp; Transport</h3>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              In accordance with Australian Dangerous Goods regulations, pure essential oils are classified as flammable aromatic liquids and are securely routed via certified ground transport to avoid cabin pressure changes.
            </p>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">
              Our insulated, shock-absorbent thermal boxing ensures oils remain preserved below 25°C throughout transit.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-lg">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
            Have questions about your delivery?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base mb-6">
            Our Melbourne client concierge is here to assist with tracking, express dispatch requests, or special apothecary gift boxing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-primary font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/90 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/returns"
              className="bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/25 transition-colors inline-flex items-center gap-2"
            >
              <span>View Returns Guarantee</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

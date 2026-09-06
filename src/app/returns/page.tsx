import type { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, HeartHandshake, HelpCircle, CheckCircle2, ArrowRight, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & 30-Day Pure Serenity Guarantee | Elavenza',
  description: 'Our 30-Day Pure Serenity Guarantee ensures you can explore our authentic Australian botanicals with complete peace of mind. Easy returns and exchanges.',
};

export default function ReturnsPage() {
  return (
    <div className="bg-bg py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase bg-secondary-soft px-3 py-1 rounded-full inline-block mb-3">
            Hassle-Free Care
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-text tracking-tight">
            The 30-Day Pure Serenity Guarantee
          </h1>
          <p className="mt-4 text-text-muted text-base md:text-lg leading-relaxed">
            Finding your signature botanical profile is a deeply personal, sensory journey.
            If an aroma or formulation does not bring complete peace and delight to your daily ritual,
            we are honored to make it right.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text">30 Days to Experience</h3>
            <p className="text-sm text-text-muted mt-2">
              Take your time to diffuse, blend, or massage. You have 30 calendar days from delivery to request a return or exchange.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-secondary-soft text-secondary flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text">Opened Bottles Welcomed</h3>
            <p className="text-sm text-text-muted mt-2">
              Unlike traditional retailers, we accept returns on gently sampled bottles. We simply ask that at least 80% of the oil remains.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text">Full Refund or Store Credit</h3>
            <p className="text-sm text-text-muted mt-2">
              Choose an immediate full refund to your original payment method, or receive a 110% store credit voucher to discover another blend.
            </p>
          </div>
        </div>

        {/* Return Steps */}
        <div className="bg-surface rounded-3xl border border-border p-8 md:p-12 mb-16 shadow-xs">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-2 text-center">
            How to Initiate a Return or Exchange
          </h2>
          <p className="text-sm text-text-muted text-center max-w-xl mx-auto mb-10">
            Our return process is designed to be calm, simple, and transparent.
          </p>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mb-4 ring-4 ring-primary/20">
                1
              </div>
              <h4 className="font-heading font-bold text-base text-text">Contact Concierge</h4>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                Email us at <a href="mailto:care@elavenza.com.au" className="text-primary underline">care@elavenza.com.au</a> with your order number and which blend was not suitable.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold text-sm flex items-center justify-center mb-4 ring-4 ring-secondary/20">
                2
              </div>
              <h4 className="font-heading font-bold text-base text-text">Receive Return Label</h4>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                We will email you a prepaid Australia Post label. Securely re-pack the bottle in its original amber glass packaging.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent-dark text-white font-bold text-sm flex items-center justify-center mb-4 ring-4 ring-accent/20">
                3
              </div>
              <h4 className="font-heading font-bold text-base text-text">Swift Reimbursement</h4>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                Upon arrival at our Melbourne lab, your refund or replacement will be processed within 48 business hours.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-16">
          <h3 className="text-xl font-heading font-bold text-text mb-6">Frequently Asked Questions</h3>

          <div className="bg-surface rounded-2xl border border-border p-6">
            <h4 className="font-heading font-semibold text-text text-base mb-2">What if my diffuser is faulty?</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Our ceramic ultrasonic diffusers are backed by a comprehensive 12-month manufacturer replacement warranty. If you encounter any ultrasonic transducer or misting issues, we provide immediate exchange at zero cost.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6">
            <h4 className="font-heading font-semibold text-text text-base mb-2">Are shipping costs refundable?</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              If you received a damaged item, incorrect product, or batch variance, we refund all shipping fees. For change-of-mind returns, a modest $8.50 return label fee is deducted from the refund unless store credit is selected.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6">
            <h4 className="font-heading font-semibold text-text text-base mb-2">Can I exchange for another essential oil?</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Yes! Our certified aromatherapist team can offer personalized scent matching based on the therapeutic note profile you were seeking (e.g. transitioning from herbaceous to floral or citrus).
            </p>
          </div>
        </div>

        {/* Need Help Banner */}
        <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-text text-lg">Need guidance on your return?</h3>
              <p className="text-sm text-text-muted mt-0.5">Our client care specialists are available Mon–Fri, 9am–5pm AEST.</p>
            </div>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-secondary/90 transition-colors shrink-0 shadow-sm"
          >
            <span>Learn About Our Philosophy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

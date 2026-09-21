import { Leaf, Sparkles, Compass, ShieldCheck, Mail } from 'lucide-react';
import UnderConstructionForm from '@/components/UnderConstructionForm';

export const metadata = {
  title: 'Elavenza Wellness | Cultivating Something Serene',
  description: 'Our botanical wellness sanctuary is currently under construction. We are mindfully preparing our collection of pure essential oils and everyday rituals.',
};

export default function UnderConstructionPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#FAF9F5] text-[#232822]">
      {/* Soft botanical ambient gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#E2EDE0]/60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-[#F3E8DB]/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-96 rounded-full bg-[#E8EFE6]/50 blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3D5634] text-white flex items-center justify-center shadow-sm">
            <Leaf size={16} />
          </div>
          <div>
            <span
              className="text-lg sm:text-xl font-medium tracking-[0.2em] text-[#1E261D] uppercase block leading-tight"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              Elavenza
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#6B7569] uppercase block font-medium">
              Wellness
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A6741] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3D5634]" />
          </span>
          <span className="text-xs uppercase tracking-widest text-[#566054] font-medium hidden sm:inline">
            Opening Soon
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-8 sm:py-16 text-center my-auto">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFE6] border border-[#D1E0CE] text-[#344D2D] text-xs font-medium tracking-wider uppercase mb-8 shadow-xs">
          <Sparkles size={13} className="text-[#B8864E]" />
          <span>Crafting Our Online Sanctuary</span>
        </div>

        {/* Poetic Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1A2219] mb-6 leading-[1.12]"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          Something thoughtful is <br className="hidden sm:inline" />
          <span className="italic font-light text-[#3D5634]">taking root.</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#555E53] max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Our website is currently undergoing a mindful refresh. We are handcrafting a calmer, more beautiful space to share our pure botanical essential oils, carrier blends, and everyday wellness rituals.
        </p>

        {/* Interactive Early Access Form */}
        <div className="mb-14">
          <UnderConstructionForm />
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-6 border-t border-[#E8E4DA]/80">
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-xs border border-[#E8E5DD]">
            <div className="w-7 h-7 rounded-lg bg-[#EBF2EA] text-[#3D5634] flex items-center justify-center mb-2.5">
              <Leaf size={15} />
            </div>
            <h4 className="text-sm font-medium text-[#222920] mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              Pure Botanicals
            </h4>
            <p className="text-xs text-[#677065] leading-relaxed">
              100% pure essential oils and cold-pressed botanical carrier oils.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-xs border border-[#E8E5DD]">
            <div className="w-7 h-7 rounded-lg bg-[#EBF2EA] text-[#3D5634] flex items-center justify-center mb-2.5">
              <Compass size={15} />
            </div>
            <h4 className="text-sm font-medium text-[#222920] mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              Mindful Rituals
            </h4>
            <p className="text-xs text-[#677065] leading-relaxed">
              Designed for morning clarity, evening calm, and everyday grounding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-xs border border-[#E8E5DD]">
            <div className="w-7 h-7 rounded-lg bg-[#EBF2EA] text-[#3D5634] flex items-center justify-center mb-2.5">
              <ShieldCheck size={15} />
            </div>
            <h4 className="text-sm font-medium text-[#222920] mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              Australian Care
            </h4>
            <p className="text-xs text-[#677065] leading-relaxed">
              Ethically sourced and bottled with care in amber UV-protective glass.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#EAE6DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E786B]">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Elavenza Wellness. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:care@elavenza.com"
            className="inline-flex items-center gap-1.5 hover:text-[#2E4228] transition-colors"
          >
            <Mail size={13} />
            <span>care@elavenza.com</span>
          </a>
          <span className="text-[#CCC7BE]">•</span>
          <span>Melbourne, Australia</span>
        </div>
      </footer>
    </div>
  );
}

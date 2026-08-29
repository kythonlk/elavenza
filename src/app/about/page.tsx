import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Elavenza - Australian owned essential oils and natural wellness products.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent text-xs font-semibold tracking-widest uppercase">Our Story</span>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold text-text">About Elavenza</h1>
          <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
            An Australian wellness brand dedicated to bringing you the purest essential oils
            and natural products for a healthier, happier life.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-3xl aspect-[4/3] flex items-center justify-center">
              <div className="text-center"><span className="text-7xl">🌿</span><p className="font-heading font-bold text-xl text-primary mt-4">Since 2024</p></div>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-text mb-6">Our Mission</h2>
              <p className="text-text-muted leading-relaxed mb-4">
                At Elavenza, we believe that nature provides everything we need for holistic wellness.
                Our mission is to make premium, pure essential oils accessible to everyone in Australia
                and beyond.
              </p>
              <p className="text-text-muted leading-relaxed mb-4">
                Every product in our range is carefully sourced from trusted growers worldwide and
                rigorously tested for purity. We never use synthetic additives, fillers, or fragrances —
                what you get is 100% pure, therapeutic-grade essential oil.
              </p>
              <p className="text-text-muted leading-relaxed">
                Based in Melbourne, we&apos;re proudly Australian owned and operated. We&apos;re passionate
                about sustainability, ethical sourcing, and sharing the incredible benefits of
                aromatherapy with our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-bg-alt/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-text text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '✨', title: 'Purity', desc: 'Every oil is 100% pure, undiluted, and free from synthetic chemicals. We test every batch for quality and authenticity.' },
              { icon: '🌱', title: 'Sustainability', desc: 'We partner with ethical growers who practice sustainable farming methods, protecting both communities and ecosystems.' },
              { icon: '🇦🇺', title: 'Australian Made', desc: 'We blend and package all our products right here in Australia, supporting local businesses and maintaining quality control.' },
            ].map(value => (
              <div key={value.title} className="bg-surface rounded-2xl border border-border p-8 text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="font-heading font-bold text-text text-lg mb-3">{value.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-text mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-text-muted text-lg mb-8">Explore our range of premium essential oils and find the perfect products for you.</p>
          <Link href="/products" className="bg-primary text-white px-8 py-3.5 rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm">
            Shop Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}

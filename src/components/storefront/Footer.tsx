import Link from 'next/link';
import { 
  Leaf, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Mail, 
  Phone
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#241F2E] text-white/90">
      {/* Trust Badges */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Leaf, title: '100% Pure Botanicals', desc: 'Ethically sourced, GC/MS tested' },
              { icon: MapPin, title: 'Australian Made', desc: 'Bottled in Melbourne, VIC' },
              { icon: Truck, title: 'Free AU Shipping', desc: 'On all orders over $75' },
              { icon: ShieldCheck, title: 'Therapeutic Grade', desc: 'Zero synthetics or fillers' },
            ].map(badge => {
              const Icon = badge.icon;
              return (
                <div key={badge.title} className="group flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white text-secondary-light transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-semibold text-white text-sm">{badge.title}</h4>
                  <p className="text-white/60 text-xs mt-1">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-heading font-bold text-white tracking-tight">Elavenza</span>
              <p className="text-[10px] text-accent tracking-widest uppercase font-semibold mt-0.5">Botanical Wellness · Australia</p>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Australia&apos;s trusted destination for pure, therapeutic-grade essential oils, certified organic carrier oils, restorative botanical skincare, and mindful wellbeing essentials.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-secondary text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-secondary text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-secondary text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4 text-accent">Categories</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Essential Oils', href: '/products?category=essential-oils' },
                { label: 'Carrier Oils', href: '/products?category=carrier-oils' },
                { label: 'Botanical Skincare', href: '/products?category=skincare' },
                { label: 'Wellbeing & Diffusers', href: '/products?category=wellbeing' },
                { label: 'All Products', href: '/products' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 text-sm hover:text-accent hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4 text-accent">Customer Care</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Our Story', href: '/about' },
                { label: 'Shipping & Delivery', href: '/about' },
                { label: 'Quality & Testing (GC/MS)', href: '/about' },
                { label: 'FAQs & Care Guide', href: '/about' },
                { label: 'Admin Portal', href: '/admin' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Melbourne, VIC 3000<br />Australia</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:hello@elavenza.com.au" className="hover:text-accent transition-colors">hello@elavenza.com.au</a>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>1300 000 000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Options */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Elavenza Australia Pty Ltd. All rights reserved. ABN 00 000 000 000
            </p>
            <div className="flex items-center gap-2">
              {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Stripe'].map(method => (
                <span key={method} className="bg-white/10 px-2.5 py-1 rounded text-[11px] text-white/70 font-medium">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

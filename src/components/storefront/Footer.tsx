import Link from 'next/link';
import Image from 'next/image';
import { LockKeyhole } from 'lucide-react';

const groups = [
  {
    title: 'Explore',
    links: [
      ['Shop all', '/products'],
      ['Essential oils', '/products?category=essential-oils'],
      ['Skincare', '/products?category=skincare'],
      ['Find your ritual', '/ritual-finder'],
    ],
  },
  {
    title: 'Here to help',
    links: [
      ['Shipping & rates', '/shipping'],
      ['International delivery', '/shipping/international'],
      ['Returns & refunds', '/returns'],
      ['FAQs & contact', '/faq'],
    ],
  },
  {
    title: 'Our world',
    links: [
      ['Our story', '/about'],
      ['Quality & certificates', '/certifications'],
      ['The wellness journal', '/journal'],
      ['Your account', '/account'],
      ['Your favourites', '/favourites'],
    ],
  },
];

const paymentBrands = ['VISA', 'mastercard', 'AMEX', 'JCB', 'Diners', 'UnionPay'];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="footer-wordmark">
            Elavenza<span>WELLNESS</span>
          </Link>
          <p>
            Rooted in nature.
            <br />
            A little closer to yourself.
          </p>
          <div className="mt-4 flex items-center gap-2.5 text-xs text-text-muted">
            <Image
              src="/images/australian-made-logo.png"
              alt="Australian Made"
              width={26}
              height={23}
              className="object-contain"
            />
            <span className="tracking-wide">Australian Made &amp; Owned</span>
          </div>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h3>{g.title}</h3>
            {g.links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="wrap footer-payments">
        <div>
          <LockKeyhole size={14} />
          <span>Secure payment powered by Stripe</span>
        </div>
        <div className="payment-brands" aria-label="Supported card brands">
          {paymentBrands.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
        <p>Additional payment options may be available at Stripe Checkout.</p>
      </div>

      <div className="wrap footer-bottom">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} Elavenza Wellness</span>
          <span>·</span>
          <span>ABN 48 447 602 072</span>
          <span>·</span>
          <span>Brisbane QLD 4051, Australia</span>
        </div>
        <span>Australia · AUD $</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}


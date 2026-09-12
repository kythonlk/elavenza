'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { CreditCard, ChevronLeft, LockKeyhole, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { createCheckoutSession } from '@/lib/api';

const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
const CARD_BRANDS = ['VISA', 'mastercard', 'AMEX', 'JCB', 'Diners', 'UnionPay'];

function imageForCartItem(image: string | undefined) {
  return image && image.startsWith('/') ? image : '/images/prod-lavender.jpg';
}

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, tax, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', shipping_first_name: '', shipping_last_name: '', shipping_address: '', shipping_city: '', shipping_state: 'VIC', shipping_postcode: '', shipping_phone: '' });
  const freeShippingRemaining = useMemo(() => Math.max(0, 75 - subtotal), [subtotal]);
  const updateForm = (field: keyof typeof form, value: string) => setForm((previous) => ({ ...previous, [field]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('elavenza-token') || undefined;
      const response = await createCheckoutSession({ items: items.map((item) => ({ product_id: item.product_id, variant_id: item.variant_id, quantity: item.quantity })), ...form }, token);
      if (!response.url) throw new Error('We could not start secure payment. Please try again.');
      window.location.assign(response.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not start secure payment. Please try again.');
      setLoading(false);
    }
  }

  if (items.length === 0) return <main className="checkout-page"><div className="checkout-empty"><span className="checkout-step">YOUR BAG</span><h1>Your bag is waiting for something lovely.</h1><p>Choose a botanical favourite and we’ll keep the checkout simple.</p><Link href="/products" className="button">Explore the collection</Link></div></main>;

  return <main className="checkout-page"><div className="checkout-shell">
    <Link className="checkout-back" href="/products"><ChevronLeft size={16} /> Continue exploring</Link>
    <header className="checkout-heading"><p className="eyebrow">A FEW MORE STEPS TO YOUR RITUAL</p><h1>Checkout, beautifully simple.</h1><p>Your payment details are entered securely on Stripe’s hosted payment page.</p></header>
    <form onSubmit={handleSubmit} className="checkout-layout">
      <section className="checkout-form" aria-label="Delivery details">
        <div className="checkout-card checkout-reveal"><div className="checkout-card-heading"><span className="checkout-number">01</span><div><h2>Contact details</h2><p>For your order confirmation and delivery updates.</p></div></div><label htmlFor="checkout-email">Email address</label><input id="checkout-email" autoComplete="email" type="email" required value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="you@example.com" /></div>
        <div className="checkout-card checkout-reveal checkout-reveal-delay"><div className="checkout-card-heading"><span className="checkout-number">02</span><div><h2>Delivery address</h2><p>Currently delivering within Australia.</p></div></div><div className="checkout-fields"><label>First name<input autoComplete="given-name" required value={form.shipping_first_name} onChange={(event) => updateForm('shipping_first_name', event.target.value)} /></label><label>Last name<input autoComplete="family-name" required value={form.shipping_last_name} onChange={(event) => updateForm('shipping_last_name', event.target.value)} /></label><label className="checkout-field-wide">Street address<input autoComplete="street-address" required value={form.shipping_address} onChange={(event) => updateForm('shipping_address', event.target.value)} /></label><label>City / suburb<input autoComplete="address-level2" required value={form.shipping_city} onChange={(event) => updateForm('shipping_city', event.target.value)} /></label><label>State<select autoComplete="address-level1" value={form.shipping_state} onChange={(event) => updateForm('shipping_state', event.target.value)}>{AU_STATES.map((state) => <option key={state}>{state}</option>)}</select></label><label>Postcode<input autoComplete="postal-code" inputMode="numeric" required pattern="[0-9]{4}" title="Enter a four-digit Australian postcode" value={form.shipping_postcode} onChange={(event) => updateForm('shipping_postcode', event.target.value.replace(/\D/g, '').slice(0, 4))} /></label><label>Phone <small>Optional</small><input autoComplete="tel" type="tel" value={form.shipping_phone} onChange={(event) => updateForm('shipping_phone', event.target.value)} /></label></div></div>
        <div className="checkout-payment-info checkout-reveal checkout-reveal-delay-2"><div className="checkout-payment-icon"><CreditCard size={22} /></div><div><strong>Pay securely with Stripe</strong><p>Card details are collected by Stripe’s encrypted checkout. Available payment methods are shown there based on your device, card and Stripe settings.</p><div className="checkout-card-brands" aria-label="Supported card brands">{CARD_BRANDS.map((brand) => <span key={brand}>{brand}</span>)}</div></div></div>
      </section>
      <aside className="checkout-summary" aria-label="Order summary"><div className="checkout-summary-inner checkout-reveal"><div className="checkout-summary-header"><div><p className="eyebrow">YOUR ORDER</p><h2>A few beautiful things.</h2></div><span>{items.length} {items.length === 1 ? 'item' : 'items'}</span></div><div className="checkout-items">{items.map((item) => <article key={`${item.product_id}-${item.variant_id}`} className="checkout-item"><div className="checkout-item-image"><Image src={imageForCartItem(item.image)} alt={item.name} fill sizes="72px" className="object-cover" /><span aria-label={`${item.quantity} items`}>{item.quantity}</span></div><div><h3>{item.name}</h3>{item.variant_name && <p>{item.variant_name}</p>}<p>Qty {item.quantity}</p></div><strong>${(item.price * item.quantity).toFixed(2)}</strong></article>)}</div>{freeShippingRemaining > 0 && <div className="checkout-shipping-progress"><Truck size={17}/><p>Add <strong>${freeShippingRemaining.toFixed(2)}</strong> more for free standard shipping.</p><div><span style={{ width: `${Math.min(100, subtotal / 75 * 100)}%` }} /></div></div>}<dl className="checkout-totals"><div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div><div><dt>Standard shipping</dt><dd>{shippingCost === 0 ? <span className="checkout-free">Free</span> : `$${shippingCost.toFixed(2)}`}</dd></div><div><dt>GST (10%)</dt><dd>${tax.toFixed(2)}</dd></div><div className="checkout-total"><dt>Total</dt><dd>${total.toFixed(2)} <small>AUD</small></dd></div></dl>{error && <p className="checkout-error" role="alert">{error}</p>}<button type="submit" disabled={loading} className="button checkout-pay">{loading ? <><span className="checkout-spinner" />Opening secure payment…</> : <><LockKeyhole size={17} />Continue to secure payment <span>${total.toFixed(2)}</span></>}</button><p className="checkout-stripe-note"><ShieldCheck size={15} /> Encrypted checkout powered by Stripe</p></div></aside>
    </form>
  </div></main>;
}

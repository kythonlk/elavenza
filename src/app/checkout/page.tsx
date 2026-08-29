'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { createCheckoutSession } from '@/lib/api';

const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, tax, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: 'VIC',
    shipping_postcode: '',
    shipping_phone: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('elavenza-token') || undefined : undefined;
      const res = await createCheckoutSession({
        items: items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        ...form,
      }, token);

      // Redirect to Stripe Checkout
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-heading font-bold text-text">Your Cart is Empty</h1>
        <p className="text-text-muted mt-2">Add some products before checking out.</p>
        <Link href="/products" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-text mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-lg text-text mb-4">Contact Information</h2>
            <input
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={e => updateForm('email', e.target.value)}
              className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Shipping Address */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="font-heading font-bold text-lg text-text mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                required
                value={form.shipping_first_name}
                onChange={e => updateForm('shipping_first_name', e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="text"
                placeholder="Last name"
                required
                value={form.shipping_last_name}
                onChange={e => updateForm('shipping_last_name', e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="text"
                placeholder="Street address"
                required
                value={form.shipping_address}
                onChange={e => updateForm('shipping_address', e.target.value)}
                className="col-span-2 bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="text"
                placeholder="City / Suburb"
                required
                value={form.shipping_city}
                onChange={e => updateForm('shipping_city', e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <select
                required
                value={form.shipping_state}
                onChange={e => updateForm('shipping_state', e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {AU_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Postcode"
                required
                pattern="[0-9]{4}"
                value={form.shipping_postcode}
                onChange={e => updateForm('shipping_postcode', e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={form.shipping_phone}
                onChange={e => updateForm('shipping_phone', e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Test Card Info */}
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-sm text-accent-dark flex items-center gap-2">
              <span>💳</span> Stripe Test Mode
            </h3>
            <p className="text-sm text-text-muted mt-2">
              Use test card: <code className="bg-surface px-2 py-0.5 rounded text-primary font-mono text-xs">4242 4242 4242 4242</code>
              <br />
              Any future expiry date, any 3-digit CVC.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border p-6 sticky top-32">
            <h2 className="font-heading font-bold text-lg text-text mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={`${item.product_id}-${item.variant_id}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-bg-alt rounded-lg flex items-center justify-center shrink-0 text-lg">🧴</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text line-clamp-1">{item.name}</p>
                    <p className="text-xs text-text-muted">Qty: {item.quantity}{item.variant_name ? ` · ${item.variant_name}` : ''}</p>
                  </div>
                  <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-text-muted">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-success font-medium">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span>GST (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-text text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>${total.toFixed(2)} AUD</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-error/10 text-error text-sm rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${total.toFixed(2)} AUD`
              )}
            </button>

            <p className="text-xs text-text-light text-center mt-3">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

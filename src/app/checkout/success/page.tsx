'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useEffect } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'N/A';
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-surface rounded-3xl border border-border p-10 shadow-lg animate-scale-in">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-heading font-bold text-text">Order Confirmed! 🎉</h1>
        <p className="text-text-muted mt-3 text-lg">Thank you for shopping with Elavenza</p>

        <div className="mt-8 bg-bg-alt rounded-2xl p-6">
          <p className="text-sm text-text-muted">Order Number</p>
          <p className="text-2xl font-heading font-bold text-primary mt-1">{orderNumber}</p>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          We&apos;ll send you a confirmation email with your order details and tracking information.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors">
            Continue Shopping
          </Link>
          <Link href="/" className="border border-border text-text px-6 py-3 rounded-xl font-medium text-sm hover:bg-bg-alt transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><p>Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}

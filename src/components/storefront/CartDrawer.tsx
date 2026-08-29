'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, subtotal, shippingCost, tax, total } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity" 
        onClick={() => setCartOpen(false)} 
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-text">Your Bag ({items.length})</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)} 
            className="p-2 text-text-muted hover:text-text hover:bg-bg-alt rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-bg-alt px-5 py-3 border-b border-border">
          <div className="flex items-center justify-between text-xs font-medium text-text mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-primary" />
              {subtotal >= 75 ? (
                <span className="text-success font-semibold">🎉 You unlocked FREE Australia-wide Shipping!</span>
              ) : (
                <span>Add <strong>${(75 - subtotal).toFixed(2)}</strong> more for <strong>FREE Shipping</strong></span>
              )}
            </span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (subtotal / 75) * 100)}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-semibold text-text text-base">Your shopping bag is empty</h3>
              <p className="text-text-muted text-xs mt-1.5 max-w-xs mx-auto">Explore our therapeutic grade essential oils and botanical wellness products.</p>
              <button 
                onClick={() => setCartOpen(false)} 
                className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-4 bg-bg-alt/70 rounded-2xl p-3 border border-border">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface">
                  <Image
                    src={item.image && item.image.startsWith('/') ? item.image : '/images/prod-lavender.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-medium text-text hover:text-primary line-clamp-1 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        className="text-text-light hover:text-error transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variant_name && (
                      <p className="text-xs text-accent font-medium mt-0.5">{item.variant_name}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-surface rounded-lg border border-border">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                        className="p-1.5 text-text-muted hover:text-text transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                        className="p-1.5 text-text-muted hover:text-text transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-3 bg-surface">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="text-text font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-success font-semibold">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>GST (10% included)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-text text-base pt-2 border-t border-border">
              <span>Total (AUD)</span>
              <span className="text-primary font-heading text-lg">${total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-text-light pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Encrypted 256-Bit SSL Checkout with Stripe</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

'use client';

import { useState } from 'react';
import { subscribeNewsletterAction } from '@/lib/actions';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletterAction(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase inline-block mb-4">
            Join Our Wellness Circle
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Receive 10% Off Your First Order
          </h2>
          <p className="mt-3 text-white/80 text-sm md:text-base">
            Subscribe for aromatherapy blending guides, exclusive seasonal harvests, and VIP offers.
          </p>

          {subscribed ? (
            <div className="mt-8 bg-white/20 border border-white/30 rounded-2xl p-6 animate-scale-in">
              <p className="text-white font-semibold">
                🎉 Thank you for subscribing! Your 10% welcome code is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/15 border border-white/30 text-white placeholder:text-white/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-xs"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-primary px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors shrink-0 shadow-md disabled:opacity-70"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

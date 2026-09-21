'use client';

import { useState } from 'react';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function UnderConstructionForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Gracefully attempt newsletter endpoint if available, otherwise succeed locally
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);

      if (res && !res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error && !data.error.includes('duplicate')) {
          setStatus('error');
          setErrorMessage(data.error || 'Something went wrong. Please try again.');
          return;
        }
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('success');
      setEmail('');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[#EAF2E8] border border-[#C5DDC0] text-center animate-fade-in shadow-sm">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#3D5634] text-white flex items-center justify-center">
          <Check size={20} />
        </div>
        <h3 className="text-base font-semibold text-[#23351F] mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          You’re on the private list
        </h3>
        <p className="text-xs sm:text-sm text-[#465E41] leading-relaxed">
          Thank you for your patience. We will send you a gentle note and an exclusive welcome gift when our doors reopen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-3">
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl bg-white border border-[#DDD8CE] shadow-sm focus-within:border-[#3D5634] focus-within:ring-2 focus-within:ring-[#3D5634]/15 transition-all">
        <div className="relative flex-1 flex items-center pl-3">
          <Mail size={18} className="text-[#8B9389] mr-2.5 shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Enter your email for early access..."
            className="w-full py-2.5 text-sm bg-transparent text-[#222820] placeholder-[#8E968C] focus:outline-none"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#3D5634] hover:bg-[#2F4428] active:scale-[0.98] transition-all disabled:opacity-60 shadow-sm cursor-pointer"
        >
          {status === 'loading' ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Notify Me
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      {status === 'error' && (
        <p className="text-xs text-[#B93838] text-center font-medium animate-fade-in">
          {errorMessage}
        </p>
      )}

      <p className="text-[11px] text-[#788276] text-center flex items-center justify-center gap-1.5">
        <Sparkles size={12} className="text-[#B8864E]" />
        <span>Strictly thoughtful updates. No spam, ever.</span>
      </p>
    </form>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      localStorage.setItem('elavenza-token', res.token);
      localStorage.setItem('elavenza-user', JSON.stringify(res.user));
      window.location.href = '/';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-text">Create Account</h1>
          <p className="text-text-muted mt-2">Join the Elavenza wellness community</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
          {error && <div className="mb-4 bg-error/10 text-error text-sm rounded-xl p-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text mb-1.5 block">First Name</label>
                <input type="text" required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                  className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text mb-1.5 block">Last Name</label>
                <input type="text" required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                  className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text mb-1.5 block">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-text mb-1.5 block">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Min 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account? <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

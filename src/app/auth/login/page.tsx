'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      localStorage.setItem('elavenza-token', res.token);
      localStorage.setItem('elavenza-user', JSON.stringify(res.user));

      if (res.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect?.startsWith('/') ? redirect : '/account';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-text">Welcome Back</h1>
          <p className="text-text-muted mt-2">Sign in to your Elavenza account</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
          {error && (
            <div className="mb-4 bg-error/10 text-error text-sm rounded-xl p-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text mb-1.5 block">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text mb-1.5 block">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-primary font-medium hover:underline">Register</Link>
            </p>
          </div>

          {/* Test credentials */}
          <div className="mt-6 bg-bg-alt rounded-xl p-4">
            <p className="text-xs font-medium text-text-muted mb-2">Test Credentials:</p>
            <p className="text-xs text-text-muted">Admin: <code className="text-primary">admin@elavenza.com.au / admin123</code></p>
            <p className="text-xs text-text-muted">Customer: <code className="text-primary">customer@test.com / test1234</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

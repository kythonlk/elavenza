'use client';

import { useState, useEffect } from 'react';
import { getAdminCustomers } from '@/lib/admin-actions';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('elavenza-token') || '';
        const res = await getAdminCustomers(token);
        if (res.success) {
          setCustomers(res.customers || []);
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">Registered Customers</h1>
        <p className="text-sm text-text-muted mt-1">Directory of registered store accounts and purchase totals.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="text-left px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Email Address</th>
                <th className="text-center px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Orders</th>
                <th className="text-right px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Total Spend</th>
                <th className="text-right px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(null).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-bg-alt rounded animate-pulse" /></td></tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    <Users className="w-8 h-8 mx-auto mb-2 text-text-light" />
                    <p className="font-medium">No registered customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} className="hover:bg-bg-alt/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-bold shrink-0">
                          {c.first_name?.[0] || 'C'}{c.last_name?.[0] || ''}
                        </div>
                        <span className="font-semibold text-text">{c.first_name} {c.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">{c.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-bg-alt border border-border px-2.5 py-1 rounded-full font-bold text-xs">
                        {c.order_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary font-heading">
                      ${c.total_spent.toFixed(2)} AUD
                    </td>
                    <td className="px-6 py-4 text-right text-text-muted text-xs">
                      {new Date(c.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getAdminDashboardStats } from '@/lib/admin-actions';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Package, 
  ArrowUpRight, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('elavenza-token') || '';
        const res = await getAdminDashboardStats(token);
        if (res.success) {
          setStats(res.stats);
        } else {
          setError(res.error || 'Failed to load dashboard');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-surface rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 rounded-2xl p-6 text-error flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toFixed(2)} AUD`, icon: DollarSign, color: 'text-success bg-success/10' },
    { label: 'Orders Completed', value: stats?.total_orders || 0, icon: ShoppingBag, color: 'text-primary bg-primary/10' },
    { label: 'Active Catalog', value: `${stats?.total_products || 0} Products`, icon: Package, color: 'text-accent-dark bg-accent/20' },
    { label: 'Registered Customers', value: stats?.total_customers || 0, icon: Users, color: 'text-purple-600 bg-purple-50' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">Dashboard Overview</h1>
        <p className="text-sm text-text-muted mt-1">Live metrics and store performance from Neon PostgreSQL.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-surface rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl lg:text-3xl font-heading font-bold text-text">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-lg text-text">Recent Orders</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="text-left px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="text-center px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                stats.recent_orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-bg-alt/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary text-xs">{order.order_number}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text">{order.shipping_first_name} {order.shipping_last_name}</p>
                      <p className="text-xs text-text-muted">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-text font-heading">
                      ${order.total.toFixed(2)} AUD
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

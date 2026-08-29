'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminOrders, updateAdminOrderStatus } from '@/lib/admin-actions';
import { ShoppingBag, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { load(); }, [filter]);

  async function load() {
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await getAdminOrders(token, filter || undefined);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  async function handleStatusChange(id: number, status: string) {
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await updateAdminOrderStatus(token, id, status);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (err) { 
      console.error(err); 
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">Orders & Fulfillment</h1>
        <p className="text-sm text-text-muted mt-1">Review customer transactions and update order delivery statuses.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button 
            key={status} 
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-colors ${
              filter === status 
                ? 'bg-primary text-white shadow-xs' 
                : 'bg-surface border border-border text-text-muted hover:text-text'
            }`}
          >
            {status ? status : 'All Orders'}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Order #</th>
                <th className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Destination</th>
                <th className="text-center px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(null).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-bg-alt rounded animate-pulse" /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-text-light" />
                    <p className="font-medium">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-bg-alt/40 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary text-xs">
                      {order.order_number}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-text">{order.shipping_first_name} {order.shipping_last_name}</p>
                      <p className="text-xs text-text-muted">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 text-text-muted text-xs">
                      {order.shipping_city}, {order.shipping_state}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <select 
                        value={order.status} 
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100'}`}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-text font-heading">
                      ${order.total.toFixed(2)} AUD
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

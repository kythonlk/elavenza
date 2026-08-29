'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminProducts, deleteAdminProduct } from '@/lib/admin-actions';
import { Plus, Search, Trash2, Edit3, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await getAdminProducts(token);
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await deleteAdminProduct(token, id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) { 
      console.error(err); 
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">Products Inventory</h1>
          <p className="text-sm text-text-muted mt-1">Manage catalog, pricing, and stock in Neon PostgreSQL.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-text-light absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product title, SKU, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">SKU</th>
                <th className="text-left px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Stock</th>
                <th className="text-center px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-text-muted font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(null).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-4 bg-bg-alt rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-text-muted">
                    <Package className="w-8 h-8 mx-auto mb-2 text-text-light" />
                    <p className="font-medium">No products found matching &quot;{search}&quot;</p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-bg-alt/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-bg-alt rounded-xl overflow-hidden shrink-0 border border-border relative">
                          <Image
                            src={`/images/prod-${p.slug.includes('lavender') ? 'lavender' : p.slug.includes('tea') ? 'teatree' : p.slug.includes('eucalyptus') ? 'eucalyptus' : p.slug.includes('jojoba') ? 'jojoba' : p.slug.includes('rosehip') ? 'rosehip' : p.slug.includes('glow') ? 'glowserum' : p.slug.includes('almond') ? 'almond' : 'diffuser'}.jpg`}
                            alt={p.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-text">{p.name}</p>
                          {p.featured && (
                            <span className="text-[10px] bg-accent/20 text-accent-dark px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted font-mono text-xs">{p.sku}</td>
                    <td className="px-5 py-3.5 text-text-muted font-medium">{p.category_name || '—'}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-primary">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-semibold ${p.stock < 10 ? 'text-error' : 'text-text'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.is_active ? 'bg-success/15 text-success' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${p.id}/edit`} 
                          className="p-1.5 text-text-muted hover:text-primary transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)} 
                          className="p-1.5 text-text-muted hover:text-error transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

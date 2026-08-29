'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoriesAction } from '@/lib/actions';
import { createAdminProduct } from '@/lib/admin-actions';
import { Plus, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', slug: '', description: '', short_desc: '', price: 0,
    compare_price: null as number | null, sku: '', stock: 0, category_id: null as number | null,
    images: ['/images/prod-lavender.jpg'] as string[], featured: false, is_active: true, weight: 0, volume_ml: 0,
    meta_title: '', meta_description: '',
  });

  useEffect(() => {
    getCategoriesAction().then(res => {
      if (res.success) setCategories(res.categories);
    }).catch(console.error);
  }, []);

  const updateForm = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'name') {
      const slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slug, meta_title: value as string }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await createAdminProduct(token, form);
      if (res.success) {
        router.push('/admin/products');
      } else {
        setError(res.error || 'Failed to create product');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-xl border border-border bg-surface hover:bg-bg-alt transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text">Create Botanical Product</h1>
            <p className="text-xs text-text-muted mt-0.5">Add a new item to the live catalog.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error text-sm rounded-2xl p-4 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-xs">
          <h2 className="font-heading font-bold text-base text-text">1. Product Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Product Title *</label>
              <input 
                type="text" 
                required 
                value={form.name} 
                onChange={e => updateForm('name', e.target.value)}
                placeholder="e.g. Australian Lavender Essential Oil"
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">URL Slug</label>
              <input 
                type="text" 
                value={form.slug} 
                onChange={e => updateForm('slug', e.target.value)}
                placeholder="e.g. australian-lavender-essential-oil"
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Short Summary</label>
            <input 
              type="text" 
              value={form.short_desc} 
              onChange={e => updateForm('short_desc', e.target.value)}
              placeholder="Brief 1-sentence botanical summary for product cards..."
              className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Detailed Description & Usage</label>
            <textarea 
              rows={5} 
              value={form.description} 
              onChange={e => updateForm('description', e.target.value)}
              placeholder="Full botanical origin, distillation method, and therapeutic benefits..."
              className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
            />
          </div>
        </div>

        {/* Pricing, Category, & Inventory */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-xs">
          <h2 className="font-heading font-bold text-base text-text">2. Pricing, Inventory & Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Price (AUD) *</label>
              <input 
                type="number" 
                step="0.01" 
                required 
                value={form.price || ''} 
                onChange={e => updateForm('price', parseFloat(e.target.value))}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Compare Price</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.compare_price || ''} 
                onChange={e => updateForm('compare_price', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Optional RRP"
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">SKU Code *</label>
              <input 
                type="text" 
                required
                value={form.sku} 
                onChange={e => updateForm('sku', e.target.value)}
                placeholder="ELV-LAV-001"
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Stock Quantity *</label>
              <input 
                type="number" 
                required
                value={form.stock} 
                onChange={e => updateForm('stock', parseInt(e.target.value, 10))}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Category</label>
              <select 
                value={form.category_id || ''} 
                onChange={e => updateForm('category_id', e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Volume (ml)</label>
              <input 
                type="number" 
                value={form.volume_ml} 
                onChange={e => updateForm('volume_ml', parseInt(e.target.value, 10))}
                placeholder="e.g. 10"
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1.5 block">Weight (kg)</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.weight} 
                onChange={e => updateForm('weight', parseFloat(e.target.value))}
                placeholder="e.g. 0.05"
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
          </div>

          <div className="flex gap-6 pt-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.featured} 
                onChange={e => updateForm('featured', e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary" 
              />
              <span className="text-sm font-medium text-text">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.is_active} 
                onChange={e => updateForm('is_active', e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary" 
              />
              <span className="text-sm font-medium text-text">Publish Live (Active)</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Creating...' : 'Publish Product'}</span>
          </button>
          <button 
            type="button" 
            onClick={() => router.back()}
            className="border border-border text-text px-6 py-3 rounded-xl text-sm font-medium hover:bg-bg-alt transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

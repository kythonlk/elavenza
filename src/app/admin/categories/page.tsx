'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAdminCategories, createAdminCategory, deleteAdminCategory } from '@/lib/admin-actions';
import { Plus, Trash2, X, Check, AlertCircle } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });

  useEffect(() => { load(); }, []);

  async function load() {
    try { 
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await getAdminCategories(token); 
      if (res.success) {
        setCategories(res.categories || []); 
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await createAdminCategory(token, form);
      if (res.success) {
        setShowForm(false);
        setForm({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });
        load();
      } else {
        setError(res.error || 'Failed to create category');
      }
    } catch (err: any) { 
      setError(err.message); 
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const token = localStorage.getItem('elavenza-token') || '';
      const res = await deleteAdminCategory(token, id);
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) { 
      console.error(err); 
    }
  }

  const categoryThumbnails: Record<string, string> = {
    'essential-oils': '/images/cat-essential-oils.jpg',
    'carrier-oils': '/images/cat-carrier-oils.jpg',
    'skincare': '/images/cat-skincare.jpg',
    'wellbeing': '/images/cat-wellbeing.jpg',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text">Store Categories</h1>
          <p className="text-sm text-text-muted mt-1">Manage main collections and starter categories.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shadow-xs"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Close Form' : 'Add Category'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error text-sm rounded-2xl p-4 mb-6 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-2xl border border-border p-6 mb-8 space-y-4 shadow-sm">
          <h2 className="font-heading font-bold text-base text-text">Create Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Aromatherapy Sprays" 
                required 
                value={form.name}
                onChange={e => { 
                  setForm(p => ({ 
                    ...p, 
                    name: e.target.value, 
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
                  })); 
                }}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Slug URL</label>
              <input 
                type="text" 
                placeholder="e.g. aromatherapy-sprays" 
                value={form.slug} 
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Description</label>
            <input 
              type="text" 
              placeholder="Short category summary for SEO and storefront badges..." 
              value={form.description} 
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-bg-alt border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
            />
          </div>
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Save Category</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(null).map((_, i) => <div key={i} className="h-44 bg-surface rounded-2xl animate-pulse" />)
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs flex flex-col justify-between group">
              <div className="relative h-32 w-full bg-bg-alt">
                <Image
                  src={categoryThumbnails[cat.slug] || '/images/cat-essential-oils.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-heading font-bold text-base leading-tight">{cat.name}</h3>
                  <span className="text-xs text-white/80 font-mono">/{cat.slug}</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary">{cat.product_count || 0} products</span>
                  <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{cat.description}</p>
                </div>
                <button 
                  onClick={() => handleDelete(cat.id, cat.name)} 
                  className="p-1.5 text-text-light hover:text-error transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/storefront/ProductCard';
import { getProductsAction } from '@/lib/actions';
import {
  Filter,
  Droplet,
  Feather,
  Sparkles,
  HeartHandshake,
  SlidersHorizontal,
  Search,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  'essential-oils': Droplet,
  'carrier-oils': Feather,
  skincare: Sparkles,
  wellbeing: HeartHandshake,
};

interface Props {
  initialProducts: any[];
  initialTotal: number;
  categories: any[];
  initialCategory: string;
  initialSearch: string;
  initialSort: string;
  initialOrder: string;
}

export default function ProductsClientShell({
  initialProducts,
  initialTotal,
  categories,
  initialCategory,
  initialSearch,
  initialSort,
  initialOrder,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [isPending, startTransition] = useTransition();

  const fetchProducts = useCallback(
    (cat: string, s: string, o: string) => {
      startTransition(async () => {
        const res = await getProductsAction({
          category: cat,
          search: initialSearch,
          sort: s,
          order: o,
          limit: 20,
          offset: 0,
        });
        if (res.success) {
          setProducts(res.products || []);
          setTotal(res.total || 0);
        }
      });

      // Also update URL for SEO & back-button correctness
      const qs = new URLSearchParams();
      if (cat) qs.set('category', cat);
      if (initialSearch) qs.set('search', initialSearch);
      router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    },
    [initialSearch, pathname, router]
  );

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    fetchProducts(cat, sort, order);
  };

  const handleSort = (val: string) => {
    const [s, o] = val.split('-');
    setSort(s);
    setOrder(o);
    fetchProducts(activeCategory, s, o);
  };

  const activeCategoryObj = categories.find(c => c.slug === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Title */}
      <div className="mb-10">
        <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">
          {initialSearch ? 'Search Results' : 'Elavenza Botanical Store'}
        </span>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-text">
          {initialSearch
            ? `Results for "${initialSearch}"`
            : activeCategoryObj
            ? activeCategoryObj.name
            : 'All Botanical Products'}
        </h1>
        {activeCategoryObj?.description && (
          <p className="text-text-muted mt-2 text-sm sm:text-base max-w-2xl">
            {activeCategoryObj.description}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-surface rounded-2xl border border-border p-5 sticky top-28 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border text-text font-heading font-bold text-sm">
              <Filter className="w-4 h-4 text-primary" />
              <span>Core Categories</span>
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => handleCategory('')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                    !activeCategory
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-muted hover:bg-bg-alt hover:text-text'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-xs opacity-70">({total})</span>
                </button>
              </li>
              {categories.map(cat => {
                const Icon = categoryIcons[cat.slug] || Droplet;
                const isSelected = activeCategory === cat.slug;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-text-muted hover:bg-bg-alt hover:text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-xs opacity-70">({cat.product_count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-surface rounded-2xl border border-border px-5 py-3.5 shadow-xs">
            <span className="text-xs sm:text-sm font-medium text-text-muted">
              Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
            </span>
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-text-muted" />
              <label htmlFor="sort-select" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Sort:
              </label>
              <select
                id="sort-select"
                value={`${sort}-${order}`}
                onChange={e => handleSort(e.target.value)}
                className="bg-bg-alt border border-border rounded-xl px-3.5 py-1.5 text-xs font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="created_at-desc">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {isPending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="bg-surface rounded-2xl border border-border p-4 animate-pulse">
                  <div className="aspect-square bg-bg-alt rounded-xl mb-4" />
                  <div className="h-4 bg-bg-alt rounded w-3/4 mb-2" />
                  <div className="h-4 bg-bg-alt rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-surface rounded-3xl border border-border p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-heading font-bold text-text">No products found</h3>
              <p className="text-text-muted text-sm mt-1 max-w-sm mx-auto">
                Try selecting another category or resetting search filters.
              </p>
              <button
                onClick={() => handleCategory('')}
                className="mt-5 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

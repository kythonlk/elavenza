// ✅ SERVER COMPONENT shell — fetches initial data server-side, passes to client filter island
import { Suspense } from 'react';
import { getCachedCategories, getCachedProducts } from '@/lib/cache';
import ProductsClientShell from '@/components/storefront/ProductsClientShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop botanical wellness',
  alternates: {canonical:'/products'},
  description: 'Browse our full range of pure essential oils, carrier oils, natural skincare, and wellness products. Australian owned.',
};

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; order?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || '';
  const search = params.search || '';
  const sort = params.sort || 'created_at';
  const order = params.order || 'desc';

  // Server-side parallel fetch with cache
  const [initialData, categories] = await Promise.all([
    getCachedProducts({ category, search, sort, order, limit: 20, offset: 0 }),
    getCachedCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse h-10 w-48 bg-bg-alt rounded-xl mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border p-4 animate-pulse">
                <div className="aspect-square bg-bg-alt rounded-xl mb-4" />
                <div className="h-4 bg-bg-alt rounded w-3/4 mb-2" />
                <div className="h-4 bg-bg-alt rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ProductsClientShell
        initialProducts={initialData.products}
        initialTotal={initialData.total}
        categories={categories}
        initialCategory={category}
        initialSearch={search}
        initialSort={sort}
        initialOrder={order}
      />
    </Suspense>
  );
}

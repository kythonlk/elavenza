// ✅ SERVER COMPONENT — SSR with dynamic metadata, ISR revalidation
import { notFound } from 'next/navigation';
import { getCachedProductBySlug, getCachedProductReviews, getCachedProducts } from '@/lib/cache';
import ProductDetailClient from '@/components/storefront/ProductDetailClient';
import type { Metadata } from 'next';

export const revalidate = 60;

// Pre-generate all product pages at build time for instant delivery
export async function generateStaticParams() {
  const data = await getCachedProducts({ limit: 100 });
  return data.products.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | Elavenza' };

  return {
    title: product.meta_title || `${product.name} | Elavenza`,
    description:
      product.meta_description ||
      product.short_desc ||
      `Buy ${product.name} from Elavenza — pure botanical quality, Australia-wide delivery.`,
    openGraph: {
      title: product.name,
      description: product.short_desc,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Parallel fetch: product + reviews together
  const [product, reviews] = await Promise.all([
    getCachedProductBySlug(slug),
    getCachedProductReviews(slug),
  ]);

  if (!product) notFound();

  return <ProductDetailClient product={product} reviews={reviews} />;
}

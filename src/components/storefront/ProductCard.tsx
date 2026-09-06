'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/api';
import { Star, ShoppingBag, Check } from 'lucide-react';

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-accent">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-accent text-accent' : 'text-border'}`}
          />
        ))}
      </div>
      <span className="text-xs text-text-muted">({count})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '/images/prod-lavender.jpg',
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imageSrc = product.images && product.images.length > 0 && product.images[0].startsWith('/') 
    ? product.images[0] 
    : '/images/prod-lavender.jpg';

  return (
    <div className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-square bg-bg-alt">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          priority={product.featured}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.compare_price && product.compare_price > product.price && (
            <span className="bg-error/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
              SAVE ${(product.compare_price - product.price).toFixed(0)}
            </span>
          )}
          {product.featured && !product.compare_price && (
            <span className="bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:block z-10">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
              added 
                ? 'bg-success text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block mb-1">
            {product.category?.name || 'Pure Essential Oil'}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-heading font-semibold text-sm sm:text-base text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="mt-1.5">
            <StarRating rating={product.avg_rating || 5} count={product.review_count || 12} />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-primary font-heading">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price && (
                <span className="text-xs sm:text-sm text-text-light line-through">
                  ${product.compare_price.toFixed(2)}
                </span>
              )}
            </div>
            {product.volume_ml > 0 && (
              <span className="text-[11px] font-medium text-text-muted bg-bg-alt px-2 py-0.5 rounded-md">
                {product.volume_ml}ml
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`mt-3 w-full py-2 rounded-xl text-xs font-medium border sm:hidden flex items-center justify-center gap-1.5 transition-colors ${
              added 
                ? 'bg-success text-white border-success' 
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{added ? 'Added' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

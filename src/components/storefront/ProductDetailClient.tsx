'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import {
  Star,
  ShoppingBag,
  Truck,
  Leaf,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronRight,
} from 'lucide-react';

interface Props {
  product: any;
  reviews: any[];
}

export default function ProductDetailClient({ product, reviews }: Props) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<number | null>(
    product.variants?.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const currentPrice = () => {
    if (selectedVariant && product.variants) {
      const v = product.variants.find((v: any) => v.id === selectedVariant);
      return v?.price || product.price;
    }
    return product.price;
  };

  const handleAddToCart = () => {
    const variant = product.variants?.find((v: any) => v.id === selectedVariant);
    addItem({
      product_id: product.id,
      variant_id: selectedVariant || undefined,
      name: product.name,
      variant_name: variant?.name,
      price: currentPrice(),
      quantity,
      image: product.images?.[0] || '/images/prod-lavender.jpg',
      slug: product.slug,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const imageSrc =
    product.images?.length > 0 && product.images[0].startsWith('/')
      ? product.images[0]
      : '/images/prod-lavender.jpg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-primary shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-primary shrink-0" prefetch={true}>Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary shrink-0" prefetch={true}>
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Image */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-alt border border-border shadow-md">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.featured && (
              <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Bestseller
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
              {product.category?.name || 'Therapeutic Botanicals'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text leading-tight">
              {product.name}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-accent">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(product.avg_rating || 5) ? 'fill-accent text-accent' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-text-muted">
                {product.avg_rating || 5.0} ({product.review_count || 12} Verified Customer Reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-heading font-bold text-primary">
                ${currentPrice().toFixed(2)} AUD
              </span>
              {product.compare_price && (
                <>
                  <span className="text-lg text-text-light line-through">${product.compare_price.toFixed(2)}</span>
                  <span className="bg-error/10 text-error text-xs font-bold px-2 py-0.5 rounded-md">
                    SAVE ${(product.compare_price - currentPrice()).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-text-muted text-sm sm:text-base leading-relaxed">
              {product.short_desc}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mt-6">
                <label className="text-xs font-bold text-text uppercase tracking-wider mb-2.5 block">
                  Select Size / Volume
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedVariant === v.id
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-border bg-surface text-text hover:border-primary/50'
                      }`}
                    >
                      {v.name} — ${v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-4">
              <div className="flex items-center justify-between sm:justify-center bg-bg-alt rounded-2xl border border-border px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-text-muted hover:text-text transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-base min-w-[2.5rem] text-center text-text">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-text-muted hover:text-text transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2.5 ${
                  addedToCart
                    ? 'bg-success text-white'
                    : 'bg-primary text-white hover:bg-primary-dark hover:shadow-primary/25'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Shopping Bag · ${(currentPrice() * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quality Badges */}
            <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-border">
              {[
                { Icon: Truck, text: 'Free AU shipping over $75' },
                { Icon: Leaf, text: '100% Pure & GC/MS Tested' },
                { Icon: ShieldCheck, text: 'Therapeutic Grade Botanicals' },
                { Icon: RotateCcw, text: '30-Day Happiness Guarantee' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-text-muted">
                  <div className="w-7 h-7 rounded-lg bg-secondary-soft text-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="max-w-4xl">
          <h2 className="font-heading font-bold text-2xl text-text mb-4">Botanical Profile & Usage</h2>
          <div className="text-text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line bg-bg-alt/50 p-6 md:p-8 rounded-3xl border border-border">
            {product.description}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading font-bold text-2xl text-text mb-8">
            Customer Reviews ({reviews.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((rev: any) => (
              <div key={rev.id} className="bg-surface rounded-2xl border border-border p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-accent">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-accent text-accent' : 'text-border'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-light font-medium">{rev.user_name}</span>
                </div>
                {rev.title && (
                  <h3 className="font-heading font-semibold text-text text-sm mb-1.5">{rev.title}</h3>
                )}
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">{rev.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

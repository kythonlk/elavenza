"use client";
import { useState, useRef, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  ShoppingBag,
  Truck,
  Leaf,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  RotateCw
} from 'lucide-react';
import { useCart } from '@/lib/cart';
import type { Product, Review } from '@/lib/api';
import FavouriteButton from './FavouriteButton';
import ProductCard from './ProductCard';
import ReviewForm from './ReviewForm';

const tabs = ['The details', 'Your ritual', 'Shipping & returns', 'Reviews'] as const;

export default function ProductDetailClient({
  product,
  reviews,
  related = [],
}: {
  product: Product;
  reviews: Review[];
  related?: Product[];
}) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState(0);
  const [added, setAdded] = useState(false);

  // Amazon-style zoom state
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ left: 0, top: 0, width: 0, height: 0, bgX: 0, bgY: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const stock = variant?.stock ?? product.stock;
  const maxQuantity = Math.max(1, Math.min(99, stock));
  const selectedQuantity = Math.min(quantity, maxQuantity);

  const images = product.images?.filter((i) => typeof i === 'string' && i.startsWith('/')) || [];
  if (!images.length) images.push('/images/prod-lavender.jpg');

  const currentImage = images[imageIndex] || images[0];
  const isSvgLabel = currentImage.endsWith('.svg');

  const total = price * selectedQuantity;
  const remaining = Math.max(0, 75 - total);
  const isDevice = product.category?.slug === 'wellbeing';
  const isSkin = ['skincare', 'carrier-oils'].includes(product.category?.slug || '');

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Lens size: 36% of image dimensions
    const lensW = rect.width * 0.36;
    const lensH = rect.height * 0.36;

    // Clamp lens inside image boundaries
    const left = Math.max(0, Math.min(rect.width - lensW, x - lensW / 2));
    const top = Math.max(0, Math.min(rect.height - lensH, y - lensH / 2));

    // Calculate background zoom translation ratio (0 to 100%)
    const maxLeft = rect.width - lensW;
    const maxTop = rect.height - lensH;
    const bgX = maxLeft > 0 ? (left / maxLeft) * 100 : 0;
    const bgY = maxTop > 0 ? (top / maxTop) * 100 : 0;

    setLensPos({ left, top, width: lensW, height: lensH, bgX, bgY });
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    }
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  function add() {
    if (stock <= 0) return;
    addItem({
      product_id: product.id,
      variant_id: variant?.id,
      variant_name: variant?.name,
      name: product.name,
      price,
      quantity: selectedQuantity,
      image: images[0],
      slug: product.slug,
    });
    setAdded(true);
  }

  return (
    <div className="wrap product-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">The botanical shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="product-layout">
        {/* Product Gallery with Amazon-Style Zoom */}
        <div className="product-gallery">
          <div className="product-main-image-wrap">
            <div
              ref={mainImageRef}
              className="product-main-image amazon-zoom-trigger"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsLightboxOpen(true)}
              role="region"
              aria-label={`Zoomable view of ${product.name}`}
            >
              {/* Main Product Image */}
              <Image
                src={currentImage}
                alt={`${product.name}, view ${imageIndex + 1}`}
                fill
                priority
                sizes="(max-width:900px) 100vw, 50vw"
                className={isSvgLabel ? 'object-contain bg-[#faf8f4]' : 'object-cover'}
              />

              {/* Amazon-style Magnifier Reticle / Lens */}
              {isHovering && (
                <div
                  className="amazon-zoom-lens"
                  style={{
                    width: `${lensPos.width}px`,
                    height: `${lensPos.height}px`,
                    transform: `translate(${lensPos.left}px, ${lensPos.top}px)`,
                  }}
                />
              )}

              {/* Collection Pill */}
              <span className="product-image-label">THE ELAVENZA COLLECTION</span>

              {/* Amazon-style Hover Zoom Indicator */}
              <div className="amazon-zoom-hint" aria-hidden="true">
                <ZoomIn size={14} />
                <span>{isSvgLabel ? 'Hover to inspect label · Click to expand' : 'Roll over image to zoom in'}</span>
              </div>

              {/* Click to expand button */}
              <button
                type="button"
                className="amazon-expand-btn"
                aria-label="Open full-screen image view"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
              >
                <Maximize2 size={16} />
              </button>

              {/* Heart Favourite Button */}
              <div className="card-favourite">
                <FavouriteButton product={product} />
              </div>
            </div>

            {/* Amazon-style External Zoom Flyout Window (Desktop) */}
            {isHovering && (
              <div className="amazon-zoom-flyout" aria-hidden="true">
                <div
                  className="amazon-zoom-canvas"
                  style={{
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${lensPos.bgX}% ${lensPos.bgY}%`,
                    backgroundSize: `${isSvgLabel ? '280%' : '260%'}`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="product-thumbnails">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                aria-label={`View ${i === 1 ? 'packaging label' : 'product bottle'} of ${product.name}`}
                aria-pressed={imageIndex === i}
                onClick={() => setImageIndex(i)}
                className={img.endsWith('.svg') ? 'thumbnail-svg' : ''}
              >
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                {img.endsWith('.svg') && <span className="thumbnail-badge">LABEL</span>}
              </button>
            ))}
            <span>A closer look at your next favourite.</span>
          </div>
        </div>

        {/* Product Purchase Panel */}
        <div className="product-purchase">
          <p className="eyebrow">{product.category?.name || 'BOTANICAL WELLNESS'}</p>
          {product.name.includes(' - Certified Organic') ? (
            <h1 className="product-title-split">
              <span className="product-title-main">{product.name.replace(' - Certified Organic', '')}</span>
              <span className="product-title-badge-cert">Certified Organic</span>
            </h1>
          ) : (
            <h1>{product.name}</h1>
          )}
          <button
            className="product-rating"
            onClick={() => {
              setTab(3);
              document.getElementById('product-tabs')?.scrollIntoView({ block: 'start' });
            }}
          >
            <span className="rating-stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={14}
                  fill={
                    product.review_count > 0 && n <= Math.round(product.avg_rating)
                      ? 'currentColor'
                      : 'none'
                  }
                />
              ))}
            </span>
            {product.review_count > 0
              ? `${Number(product.avg_rating).toFixed(1)} · ${product.review_count} reviews`
              : 'Be the first to share your ritual'}
          </button>

          <div className="product-price">
            ${price.toFixed(2)} <small>AUD</small>
            {product.compare_price && product.compare_price > price ? (
              <>
                <del>${product.compare_price.toFixed(2)}</del>
                <span className="offer-pill">Save ${(product.compare_price - price).toFixed(2)}</span>
              </>
            ) : null}
          </div>

          <p className="product-summary">
            {product.short_desc || 'A thoughtful addition to your everyday botanical ritual.'}
          </p>

          <div className="product-availability">
            <span className={stock > 0 ? 'stock-dot' : 'stock-dot sold-out'} />
            {stock > 0 ? 'In stock · ready for your ritual' : 'Currently out of stock'}
          </div>

          {product.variants && product.variants.length > 0 && (
            <fieldset className="product-variants">
              <legend>Choose your size</legend>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={variantId === v.id}
                  onClick={() => {
                    setVariantId(v.id);
                    setQuantity(1);
                    setAdded(false);
                  }}
                >
                  {v.name}
                  {v.stock <= 0 ? ' · Sold out' : ''}
                </button>
              ))}
            </fieldset>
          )}

          <div className="product-buy-row">
            <div className="product-quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={selectedQuantity <= 1}
                onClick={() => {
                  setQuantity((q) => Math.max(1, q - 1));
                  setAdded(false);
                }}
              >
                <Minus size={15} />
              </button>
              <output aria-label="Quantity">{selectedQuantity}</output>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={stock <= 0 || selectedQuantity >= maxQuantity}
                onClick={() => {
                  setQuantity((q) => Math.min(maxQuantity, q + 1));
                  setAdded(false);
                }}
              >
                <Plus size={15} />
              </button>
            </div>

            <button className="button" disabled={stock <= 0} onClick={add}>
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              {stock <= 0 ? 'Out of stock' : added ? 'Added to your bag' : `Add to bag · $${total.toFixed(2)}`}
            </button>
          </div>

          <div className="product-save">
            <FavouriteButton product={product} label />
            <span>Good things are worth coming back to.</span>
          </div>

          <div className="product-delivery-note">
            <Truck size={21} />
            <div>
              <strong>
                {remaining === 0
                  ? 'This selection qualifies for free AU shipping.'
                  : `$${remaining.toFixed(2)} away from free AU shipping.`}
              </strong>
              <p>Based on this selection. Your full bag may already qualify.</p>
            </div>
          </div>

          <div className="product-promises">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
              <Image
                src="/images/australian-made-logo.png"
                alt="Australian Made"
                width={20}
                height={17}
                className="object-contain inline-block"
              />
              Australian Made
            </span>
            <Link href="/certifications">
              <Leaf size={17} />
              Ingredients &amp; quality
            </Link>
            <Link href="/returns">
              <RotateCcw size={17} />
              Returns &amp; care
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs & Detailed Specifications */}
      <section id="product-tabs" className="product-information">
        <div className="product-tabs" role="tablist" aria-label="Product information">
          {tabs.map((label, i) => (
            <button
              id={`product-tab-${i}`}
              key={label}
              role="tab"
              aria-selected={tab === i}
              aria-controls={`product-panel-${i}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={(e) => {
                let next = i;
                if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
                else if (e.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = tabs.length - 1;
                else return;
                e.preventDefault();
                setTab(next);
                document.getElementById(`product-tab-${next}`)?.focus();
              }}
            >
              {label}
              {i === 3 && <span>{reviews.length}</span>}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`product-panel-${tab}`}
          aria-labelledby={`product-tab-${tab}`}
          tabIndex={0}
          className="product-tab-panel"
        >
          {tab === 0 && (
            <div className="product-detail-grid">
              <div>
                <p className="eyebrow">A CLOSER LOOK</p>
                <h2>Get to know your botanical.</h2>
                <p className="whitespace-pre-line">
                  {product.description ||
                    product.short_desc ||
                    'Please refer to the product label for its complete description and directions.'}
                </p>
              </div>
              <dl className="product-specs">
                <div>
                  <dt>Collection</dt>
                  <dd>{product.category?.name || 'Botanical wellness'}</dd>
                </div>
                <div>
                  <dt>Product reference</dt>
                  <dd>{variant?.sku || product.sku || 'See product label'}</dd>
                </div>
                {variant && (
                  <div>
                    <dt>Selected option</dt>
                    <dd>{variant.name}</dd>
                  </div>
                )}
                {product.volume_ml > 0 && (
                  <div>
                    <dt>Base product volume</dt>
                    <dd>{product.volume_ml} ml</dd>
                  </div>
                )}
                {product.weight > 0 && (
                  <div>
                    <dt>Listed product weight</dt>
                    <dd>{product.weight} g</dd>
                  </div>
                )}
                <div>
                  <dt>Availability</dt>
                  <dd>{stock > 0 ? 'In stock' : 'Out of stock'}</dd>
                </div>
                <div>
                  <dt>Packaging</dt>
                  <dd>Recyclable amber UV glass &amp; dropper</dd>
                </div>
                <div>
                  <dt>Origin &amp; Bottling</dt>
                  <dd>Australian Made · Brisbane QLD 4051</dd>
                </div>
                <div>
                  <dt>Currency</dt>
                  <dd>Australian dollars</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === 1 && (
            <div className="product-detail-grid">
              <div>
                <p className="eyebrow">MAKE IT PART OF YOUR EVERYDAY</p>
                <h2>
                  {isDevice ? 'Set the scene.' : isSkin ? 'A moment of care.' : 'Let your senses lead.'}
                </h2>
                <p>
                  {isDevice
                    ? 'Choose a favourite corner of your home and make room for a small daily pause. Follow the device instructions for setup, cleaning and suitable oils.'
                    : isSkin
                    ? 'Bring a little attention to your usual routine. Follow the product’s label for the intended application and amount, and check the full ingredient list before use.'
                    : 'Take a moment to enjoy the character of your chosen botanical. Check the label for suitable applications and directions before making it part of your routine.'}
                </p>
                <p>
                  Product-specific ingredients, storage and usage directions on the label take
                  precedence. Keep the original packaging so those details stay close to hand.
                </p>
                <Link className="text-link" href="/ritual-finder">
                  Find your everyday ritual <ArrowRight size={15} />
                </Link>
              </div>
              <div className="ritual-product-card">
                <span>01 / MAKE A LITTLE SPACE</span>
                <h3>
                  Small moments.
                  <br />
                  Beautiful possibilities.
                </h3>
                <p>Find more inspiration in the Elavenza journal.</p>
                <Link href="/journal" className="text-link">
                  Explore the journal ↗
                </Link>
              </div>
            </div>
          )}

          {tab === 2 && (
            <div className="product-detail-grid">
              <div>
                <p className="eyebrow">DELIVERY FOR YOUR SELECTION</p>
                <h2>Your botanical, on its way.</h2>
                <p>
                  {product.name}
                  {variant ? ` · ${variant.name}` : ''} · Quantity {selectedQuantity}
                </p>
                <dl className="product-specs">
                  <div>
                    <dt>Selection subtotal</dt>
                    <dd>${total.toFixed(2)} AUD</dd>
                  </div>
                  <div>
                    <dt>Standard AU shipping*</dt>
                    <dd>{remaining === 0 ? 'Free' : '$9.95 AUD'}</dd>
                  </div>
                  <div>
                    <dt>Availability</dt>
                    <dd>{stock > 0 ? 'In stock' : 'Currently unavailable'}</dd>
                  </div>
                </dl>
                <p className="small-note">
                  *Estimate for this selection alone. Free standard shipping applies when your full
                  product subtotal reaches $75. Your final shipping cost appears at checkout.
                </p>
              </div>
              <div>
                <h3>Delivery details</h3>
                <p>
                  Dispatch and transit times depend on stock, destination and carrier. No express or
                  arrival date is guaranteed for this product here. The checkout currently supports
                  Australian delivery.
                </p>
                <h3>Returns &amp; product care</h3>
                <p>
                  If your item arrives damaged or incorrect, keep the packaging and order details. Refer
                  to our returns guide before sending anything back.
                </p>
                <div className="flex flex-wrap gap-5">
                  <Link className="text-link" href="/shipping">
                    Full shipping guide ↗
                  </Link>
                  <Link className="text-link" href="/returns">
                    Returns &amp; refunds ↗
                  </Link>
                </div>
              </div>
            </div>
          )}

          {tab === 3 && (
            <div className="product-review-grid">
              <div>
                <p className="eyebrow">FROM ONE RITUAL TO ANOTHER</p>
                <h2>Customer notes.</h2>
                {reviews.length === 0 ? (
                  <p>No reviews yet. Be the first to share your experience.</p>
                ) : (
                  reviews.map((review) => (
                    <article className="customer-review" key={review.id}>
                      <div
                        className="rating-stars"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={15}
                            fill={n <= review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <h3>{review.title}</h3>
                      <p>{review.content}</p>
                      <span>
                        {review.user_name || 'Elavenza customer'} ·{' '}
                        {new Date(review.created_at).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </article>
                  ))
                )}
              </div>
              <ReviewForm slug={product.slug} />
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE MORE TO LOVE</p>
              <h2>Keep the ritual going.</h2>
            </div>
            <Link href="/products" className="text-link">
              Explore the collection ↗
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Full-Screen Interactive Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="product-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-resolution image zoom inspection"
        >
          <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="product-lightbox-header">
              <div className="lightbox-title">
                <strong>{product.name}</strong>
                <span>{imageIndex === 1 ? 'Full Apothecary Label & Ingredients' : 'Studio Product View'}</span>
              </div>
              <div className="lightbox-controls">
                <button
                  type="button"
                  onClick={() => setLightboxScale((s) => Math.min(3.5, s + 0.35))}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxScale((s) => Math.max(0.7, s - 0.35))}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxScale(1)}
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  title="Close inspection"
                  aria-label="Close inspection"
                  className="lightbox-close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="product-lightbox-stage">
              <div
                className="product-lightbox-viewport"
                style={{
                  transform: `scale(${lightboxScale})`,
                  transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-w-full max-h-[80vh] object-contain select-none shadow-2xl rounded"
                />
              </div>
            </div>

            <div className="product-lightbox-footer">
              <div className="lightbox-thumbs">
                {images.map((img, i) => (
                  <button
                    key={`modal-${img}-${i}`}
                    onClick={() => {
                      setImageIndex(i);
                      setLightboxScale(1);
                    }}
                    className={imageIndex === i ? 'is-active' : ''}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-12 h-12 object-cover rounded" />
                  </button>
                ))}
              </div>
              <p>Tip: Use controls to zoom in and examine botanical ingredients and certifications.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

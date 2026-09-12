import { unstable_cache } from 'next/cache';
import { query } from './db';

// ─── Cached DB helpers ────────────────────────────────────────────────
// Cached for 60s for products, 5 min for categories
// Revalidated on demand via revalidateTag()

export const getCachedFeaturedProducts = unstable_cache(
  async (limit = 8) => {
    try {
      const res = await query(
        `SELECT p.id, p.name, p.slug, p.short_desc, p.price, p.compare_price,
                p.sku, p.stock, p.images, p.featured,
                COALESCE(c.name, '') as category_name,
                COALESCE(c.slug, '') as category_slug,
                COALESCE(r.review_count, 0)::int as review_count,
                COALESCE(r.avg_rating, 5.0)::float as avg_rating
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN (
           SELECT product_id, COUNT(*) as review_count, AVG(rating)::numeric(3,1) as avg_rating
           FROM reviews WHERE is_approved = true GROUP BY product_id
         ) r ON p.id = r.product_id
         WHERE p.is_active = true AND p.featured = true
         ORDER BY p.created_at DESC
         LIMIT $1`,
        [limit]
      );
      return res.rows.map(row => ({
        ...row,
        price: parseFloat(row.price),
        compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
        images: Array.isArray(row.images) ? row.images : [],
        category: row.category_name ? { name: row.category_name, slug: row.category_slug } : undefined,
      }));
    } catch (err) {
      console.error('[getCachedFeaturedProducts error]:', err);
      return [];
    }
  },
  ['featured-products'],
  { revalidate: 60, tags: ['products'] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    try {
      const res = await query(
        `SELECT c.id, c.name, c.slug, c.description, c.image_url, c.parent_id,
                c.sort_order, c.is_active, c.created_at,
                (SELECT COUNT(*)::int FROM products WHERE category_id = c.id AND is_active = true) as product_count
         FROM categories c
         WHERE c.is_active = true
         ORDER BY c.sort_order ASC`
      );
      return res.rows;
    } catch (err) {
      console.error('[getCachedCategories error]:', err);
      return [];
    }
  },
  ['all-categories'],
  { revalidate: 300, tags: ['categories'] }
);

export const getCachedProducts = unstable_cache(
  async (params: {
    category?: string;
    search?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    onSale?: boolean;
    minRating?: number;
  }) => {
    try {
    const { category = '', search = '', sort = 'created_at', order = 'desc', limit = 20, offset = 0 } = params;
    const allowedSorts = ['price', 'name', 'created_at'];
    const safeSort = allowedSorts.includes(sort) ? sort : 'created_at';
    const safeOrder = order === 'asc' ? 'ASC' : 'DESC';

    const args: any[] = [];
    let argIdx = 1;
    let where = 'WHERE p.is_active = true';

    if (category) {
      where += ` AND c.slug = $${argIdx}`;
      args.push(category);
      argIdx++;
    }

    if (search) {
      where += ` AND (p.name ILIKE $${argIdx} OR p.description ILIKE $${argIdx})`;
      args.push(`%${search}%`);
      argIdx++;
    }

    if (params.minPrice !== undefined && Number.isFinite(params.minPrice)) {where += ` AND p.price >= $${argIdx++}`;args.push(params.minPrice);}
    if (params.maxPrice !== undefined && Number.isFinite(params.maxPrice)) {where += ` AND p.price <= $${argIdx++}`;args.push(params.maxPrice);}
    if (params.inStock) where += ' AND p.stock > 0';
    if (params.onSale) where += ' AND p.compare_price > p.price';
    if (params.minRating) {where += ` AND r.avg_rating >= $${argIdx++} AND r.review_count > 0`;args.push(params.minRating);}

    // Single query with COUNT via window function — no second round trip
    const sql = `
      SELECT p.id, p.name, p.slug, p.short_desc, p.price, p.compare_price,
             p.sku, p.stock, p.images, p.featured,
             COALESCE(c.name, '') as category_name,
             COALESCE(c.slug, '') as category_slug,
             COALESCE(r.review_count, 0)::int as review_count,
             COALESCE(r.avg_rating, 5.0)::float as avg_rating,
             COUNT(*) OVER()::int as total_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN (
        SELECT product_id, COUNT(*) as review_count, AVG(rating)::numeric(3,1) as avg_rating
        FROM reviews WHERE is_approved = true GROUP BY product_id
      ) r ON p.id = r.product_id
      ${where}
      ORDER BY p.${safeSort} ${safeOrder}, p.id ASC
      LIMIT $${argIdx} OFFSET $${argIdx + 1}`;
    args.push(limit, offset);

    const res = await query(sql, args);
    const total = res.rows[0]?.total_count ?? 0;

    const products = res.rows.map(row => ({
      ...row,
      price: parseFloat(row.price),
      compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
      images: Array.isArray(row.images) ? row.images : [],
      category: row.category_name ? { name: row.category_name, slug: row.category_slug } : undefined,
    }));

      return { products, total };
    } catch (error) {
      console.error('[getCachedProducts error]:', error);
      return { products: [], total: 0 };
    }
  },
  ['products-list'],
  { revalidate: 60, tags: ['products'] }
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    const res = await query(
      `SELECT p.id, p.name, p.slug, p.description, p.short_desc, p.price, p.compare_price,
              p.sku, p.stock, p.category_id, p.images, p.featured, p.is_active,
              p.weight, p.volume_ml, p.meta_title, p.meta_description, p.created_at,
              COALESCE(c.name, '') as category_name,
              COALESCE(c.slug, '') as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = true`,
      [slug]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];

    // Parallelise variants + review stats
    const [varRes, revStats] = await Promise.all([
      query(
        `SELECT id, product_id, name, price, sku, stock, sort_order
         FROM product_variants WHERE product_id = $1 ORDER BY sort_order`,
        [row.id]
      ),
      query(
        `SELECT COUNT(*)::int as review_count, COALESCE(AVG(rating)::numeric(3,1), 5.0)::float as avg_rating
         FROM reviews WHERE product_id = $1 AND is_approved = true`,
        [row.id]
      ),
    ]);

    return {
      ...row,
      price: parseFloat(row.price),
      compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
      images: Array.isArray(row.images) ? row.images : [],
      category: row.category_name ? { name: row.category_name, slug: row.category_slug } : undefined,
      variants: varRes.rows.map((v: any) => ({ ...v, price: parseFloat(v.price) })),
      review_count: revStats.rows[0]?.review_count ?? 0,
      avg_rating: revStats.rows[0]?.avg_rating ?? 5.0,
    };
  },
  ['product-by-slug'],
  { revalidate: 60, tags: ['products'] }
);

export const getCachedProductReviews = unstable_cache(
  async (slug: string) => {
    const res = await query(
      `SELECT rv.id, rv.rating, rv.title, rv.content, rv.created_at,
              COALESCE(u.first_name || ' ' || LEFT(u.last_name,1) || '.', 'Verified Buyer') as user_name
       FROM reviews rv
       JOIN products p ON rv.product_id = p.id
       LEFT JOIN users u ON rv.user_id = u.id
       WHERE p.slug = $1 AND rv.is_approved = true
       ORDER BY rv.created_at DESC`,
      [slug]
    );
    return res.rows;
  },
  ['product-reviews'],
  { revalidate: 120, tags: ['reviews'] }
);

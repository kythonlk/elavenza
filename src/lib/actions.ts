'use server';

import { query } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

const stripeSecret = process.env.API_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, {
  apiVersion: '2025-02-24.acacia' as any,
}) : null;

const JWT_SECRET = process.env.JWT_SECRET || 'elavenza-jwt-secret-change-in-production-2024';

// ----------------------------------------------------
// 1. PRODUCTS (Server Actions)
// ----------------------------------------------------
export async function getProductsAction(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const category = params?.category || '';
    const featured = params?.featured;
    const search = params?.search || '';
    let sort = params?.sort || 'created_at';
    let order = params?.order || 'desc';
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;

    const allowedSorts = ['price', 'name', 'created_at'];
    if (!allowedSorts.includes(sort)) sort = 'created_at';
    if (order !== 'asc') order = 'desc';

    let sql = `
      SELECT p.id, p.name, p.slug, p.short_desc, p.price, p.compare_price,
             p.sku, p.stock, p.category_id, p.images, p.featured, p.is_active,
             p.volume_ml, p.created_at,
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
      WHERE p.is_active = true
    `;

    const args: any[] = [];
    let argIdx = 1;

    if (category) {
      sql += ` AND c.slug = $${argIdx}`;
      args.push(category);
      argIdx++;
    }

    if (featured) {
      sql += ` AND p.featured = true`;
    }

    if (search) {
      sql += ` AND (p.name ILIKE $${argIdx} OR p.description ILIKE $${argIdx})`;
      args.push(`%${search}%`);
      argIdx++;
    }

    sql += ` ORDER BY p.${sort} ${order} LIMIT $${argIdx} OFFSET $${argIdx + 1}`;
    args.push(limit, offset);

    const res = await query(sql, args);

    // Format output
    const products = res.rows.map(row => ({
      ...row,
      price: parseFloat(row.price),
      compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
      images: Array.isArray(row.images) ? row.images : [],
      category: row.category_name ? { name: row.category_name, slug: row.category_slug } : undefined,
    }));

    const countRes = await query(`SELECT COUNT(*)::int as total FROM products WHERE is_active = true`);
    const total = countRes.rows[0]?.total || products.length;

    return { success: true, products, total, limit, offset };
  } catch (error: any) {
    console.error('getProductsAction error:', error);
    return { success: false, error: error.message, products: [], total: 0 };
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    const res = await query(`
      SELECT p.id, p.name, p.slug, p.description, p.short_desc, p.price, p.compare_price,
             p.sku, p.stock, p.category_id, p.images, p.featured, p.is_active,
             p.weight, p.volume_ml, p.meta_title, p.meta_description, p.created_at,
             COALESCE(c.name, '') as category_name,
             COALESCE(c.slug, '') as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `, [slug]);

    if (res.rows.length === 0) return { success: false, error: 'Product not found' };

    const row = res.rows[0];

    // Variants
    const varRes = await query(`
      SELECT id, product_id, name, price, sku, stock, sort_order
      FROM product_variants WHERE product_id = $1 ORDER BY sort_order
    `, [row.id]);

    // Review stats
    const revStats = await query(`
      SELECT COUNT(*)::int as review_count, COALESCE(AVG(rating)::numeric(3,1), 5.0)::float as avg_rating
      FROM reviews WHERE product_id = $1 AND is_approved = true
    `, [row.id]);

    const product = {
      ...row,
      price: parseFloat(row.price),
      compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
      images: Array.isArray(row.images) ? row.images : [],
      category: row.category_name ? { name: row.category_name, slug: row.category_slug } : undefined,
      variants: varRes.rows.map(v => ({ ...v, price: parseFloat(v.price) })),
      review_count: revStats.rows[0]?.review_count || 0,
      avg_rating: revStats.rows[0]?.avg_rating || 5.0,
    };

    return { success: true, product };
  } catch (error: any) {
    console.error('getProductBySlugAction error:', error);
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------
// 2. CATEGORIES (Server Actions)
// ----------------------------------------------------
export async function getCategoriesAction() {
  try {
    const res = await query(`
      SELECT c.id, c.name, c.slug, c.description, c.image_url, c.parent_id,
             c.sort_order, c.is_active, c.created_at,
             (SELECT COUNT(*)::int FROM products WHERE category_id = c.id AND is_active = true) as product_count
      FROM categories c
      WHERE c.is_active = true
      ORDER BY c.sort_order ASC
    `);

    return { success: true, categories: res.rows };
  } catch (error: any) {
    console.error('getCategoriesAction error:', error);
    return { success: false, categories: [], error: error.message };
  }
}

// ----------------------------------------------------
// 3. AUTH (Server Actions)
// ----------------------------------------------------
export async function loginAction(formData: { email: string; password: string }) {
  try {
    const { email, password } = formData;
    const res = await query(`
      SELECT id, email, password_hash, first_name, last_name, role, created_at
      FROM users WHERE email = $1
    `, [email]);

    if (res.rows.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = res.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = jwt.sign(
      { user_id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: user.created_at,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerAction(data: { email: string; password: string; first_name: string; last_name: string }) {
  try {
    const hash = await bcrypt.hash(data.password, 10);
    const res = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, 'customer')
      RETURNING id, email, first_name, last_name, role, created_at
    `, [data.email, hash, data.first_name, data.last_name]);

    const user = res.rows[0];
    const token = jwt.sign(
      { user_id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { success: true, token, user };
  } catch (error: any) {
    if (error.code === '23505') {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------
// 4. CHECKOUT & STRIPE SESSION (Server Action)
// ----------------------------------------------------
export async function createCheckoutSessionAction(data: {
  items: { product_id: number; variant_id?: number; quantity: number }[];
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_phone: string;
  email: string;
}, token?: string) {
  try {
    let subtotal = 0;
    const lineItems: any[] = [];
    const orderItems: any[] = [];

    for (const item of data.items) {
      let name = '';
      let price = 0;
      let variantName = '';

      if (item.variant_id) {
        const vRes = await query(`
          SELECT p.name, pv.name as variant_name, pv.price
          FROM product_variants pv
          JOIN products p ON pv.product_id = p.id
          WHERE pv.id = $1 AND p.id = $2
        `, [item.variant_id, item.product_id]);

        if (vRes.rows.length === 0) throw new Error(`Variant ${item.variant_id} not found`);
        name = `${vRes.rows[0].name} - ${vRes.rows[0].variant_name}`;
        price = parseFloat(vRes.rows[0].price);
        variantName = vRes.rows[0].variant_name;
      } else {
        const pRes = await query(`SELECT name, price FROM products WHERE id = $1`, [item.product_id]);
        if (pRes.rows.length === 0) throw new Error(`Product ${item.product_id} not found`);
        name = pRes.rows[0].name;
        price = parseFloat(pRes.rows[0].price);
      }

      subtotal += price * item.quantity;
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      });

      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: name,
        variant_name: variantName,
        quantity: item.quantity,
        unit_price: price,
        total_price: price * item.quantity,
      });
    }

    const shippingCost = subtotal >= 75 ? 0 : 9.95;
    const tax = subtotal * 0.10;
    const total = subtotal + shippingCost + tax;
    const orderNumber = `ELV-${Math.floor(100000 + Math.random() * 900000)}`;

    let userId: number | null = null;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.user_id;
      } catch {}
    }

    const orderRes = await query(`
      INSERT INTO orders (user_id, order_number, status, subtotal, shipping_cost, tax, total,
                          shipping_first_name, shipping_last_name, shipping_address,
                          shipping_city, shipping_state, shipping_postcode, shipping_phone)
      VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      userId, orderNumber, subtotal, shippingCost, tax, total,
      data.shipping_first_name, data.shipping_last_name, data.shipping_address,
      data.shipping_city, data.shipping_state, data.shipping_postcode, data.shipping_phone,
    ]);

    const orderId = orderRes.rows[0].id;

    for (const item of orderItems) {
      await query(`
        INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_name, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [orderId, item.product_id, item.variant_id, item.product_name, item.variant_name, item.quantity, item.unit_price, item.total_price]);
    }

    // Add shipping & GST line items
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: 'Standard Shipping (Australia)' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    lineItems.push({
      price_data: {
        currency: 'aud',
        product_data: { name: 'GST (10%)' },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

    let sessionUrl = `${origin}/checkout/success?order=${orderNumber}`;

    if (process.env.API_STRIPE_SECRET_KEY) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
        cancel_url: `${origin}/checkout`,
        customer_email: data.email,
        metadata: { order_id: orderId.toString(), order_number: orderNumber },
      });
      sessionUrl = session.url || sessionUrl;
    }

    return {
      success: true,
      url: sessionUrl,
      order_number: orderNumber,
      total,
    };
  } catch (error: any) {
    console.error('createCheckoutSessionAction error:', error);
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------
// 5. REVIEWS & NEWSLETTER (Server Actions)
// ----------------------------------------------------
export async function submitReviewAction(slug: string, data: { rating: number; title: string; content: string }, token: string) {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const prodRes = await query(`SELECT id FROM products WHERE slug = $1`, [slug]);
    if (prodRes.rows.length === 0) throw new Error('Product not found');

    await query(`
      INSERT INTO reviews (product_id, user_id, rating, title, content, is_approved)
      VALUES ($1, $2, $3, $4, $5, true)
    `, [prodRes.rows[0].id, decoded.user_id, data.rating, data.title, data.content]);

    revalidatePath(`/products/${slug}`);
    return { success: true, message: 'Review submitted successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function subscribeNewsletterAction(email: string) {
  try {
    await query(`
      INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING
    `, [email]);
    return { success: true, message: 'Thank you for subscribing!' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------
// 6. ADMIN DASHBOARD & MANAGEMENT (Server Actions)
// ----------------------------------------------------
export async function adminGetDashboardStatsAction(token: string) {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Unauthorized');

    const ordersRes = await query(`SELECT COUNT(*)::int as total_orders FROM orders`);
    const revRes = await query(`SELECT COALESCE(SUM(total), 0)::float as total_revenue FROM orders WHERE status != 'cancelled'`);
    const custRes = await query(`SELECT COUNT(*)::int as total_customers FROM users WHERE role = 'customer'`);
    const prodRes = await query(`SELECT COUNT(*)::int as total_products FROM products WHERE is_active = true`);

    const recentOrders = await query(`
      SELECT id, order_number, status, total, shipping_first_name, shipping_last_name, created_at
      FROM orders ORDER BY created_at DESC LIMIT 5
    `);

    return {
      success: true,
      stats: {
        total_orders: ordersRes.rows[0].total_orders,
        total_revenue: revRes.rows[0].total_revenue,
        total_customers: custRes.rows[0].total_customers,
        total_products: prodRes.rows[0].total_products,
        recent_orders: recentOrders.rows.map(o => ({ ...o, total: parseFloat(o.total) })),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

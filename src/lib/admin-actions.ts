'use server';

import { query } from './db';
import { verifyAdminToken } from './auth';
import { revalidatePath } from 'next/cache';

// ----------------------------------------------------
// 1. DASHBOARD ANALYTICS
// ----------------------------------------------------
export async function getAdminDashboardStats(token: string) {
  try {
    verifyAdminToken(token);

    const ordersRes = await query(`SELECT COUNT(*)::int as total_orders FROM orders`);
    const revRes = await query(`SELECT COALESCE(SUM(total), 0)::float as total_revenue FROM orders WHERE status != 'cancelled'`);
    const custRes = await query(`SELECT COUNT(*)::int as total_customers FROM users WHERE role = 'customer'`);
    const prodRes = await query(`SELECT COUNT(*)::int as total_products FROM products WHERE is_active = true`);

    const recentOrders = await query(`
      SELECT o.id, o.order_number, o.status, o.total, o.shipping_first_name, o.shipping_last_name, o.created_at,
             COALESCE(u.email, '') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 6
    `);

    return {
      success: true,
      stats: {
        total_orders: ordersRes.rows[0]?.total_orders || 0,
        total_revenue: revRes.rows[0]?.total_revenue || 0,
        total_customers: custRes.rows[0]?.total_customers || 0,
        total_products: prodRes.rows[0]?.total_products || 0,
        recent_orders: recentOrders.rows.map(o => ({
          ...o,
          total: parseFloat(o.total),
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 2. PRODUCTS MANAGEMENT
// ----------------------------------------------------
export async function getAdminProducts(token: string, search?: string) {
  try {
    verifyAdminToken(token);

    let sql = `
      SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.sku, p.stock,
             p.featured, p.is_active, p.created_at,
             COALESCE(c.name, '') as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const args: any[] = [];

    if (search) {
      sql += ` WHERE p.name ILIKE $1 OR p.sku ILIKE $1 OR c.name ILIKE $1`;
      args.push(`%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const res = await query(sql, args);
    const products = res.rows.map(p => ({
      ...p,
      price: parseFloat(p.price),
      compare_price: p.compare_price ? parseFloat(p.compare_price) : null,
    }));

    return { success: true, products };
  } catch (err: any) {
    return { success: false, products: [], error: err.message };
  }
}

export async function createAdminProduct(token: string, data: {
  name: string;
  slug: string;
  description: string;
  short_desc: string;
  price: number;
  compare_price?: number | null;
  sku: string;
  stock: number;
  category_id?: number | null;
  images?: string[];
  featured?: boolean;
  is_active?: boolean;
  weight?: number;
  volume_ml?: number;
  meta_title?: string;
  meta_description?: string;
}) {
  try {
    verifyAdminToken(token);

    const imagesArray = Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : ['/images/prod-lavender.jpg'];

    const res = await query(`
      INSERT INTO products (
        name, slug, description, short_desc, price, compare_price,
        sku, stock, category_id, images, featured, is_active,
        weight, volume_ml, meta_title, meta_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id
    `, [
      data.name, data.slug, data.description, data.short_desc, data.price, data.compare_price || null,
      data.sku, data.stock, data.category_id || null, imagesArray, data.featured || false, data.is_active !== false,
      data.weight || 0, data.volume_ml || 0, data.meta_title || data.name, data.meta_description || data.short_desc,
    ]);

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');

    return { success: true, id: res.rows[0].id, message: 'Product created successfully' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAdminProduct(token: string, id: number, data: any) {
  try {
    verifyAdminToken(token);

    await query(`
      UPDATE products SET
        name = $1, slug = $2, description = $3, short_desc = $4,
        price = $5, compare_price = $6, sku = $7, stock = $8,
        category_id = $9, images = $10, featured = $11, is_active = $12,
        weight = $13, volume_ml = $14, meta_title = $15, meta_description = $16,
        updated_at = NOW()
      WHERE id = $17
    `, [
      data.name, data.slug, data.description, data.short_desc,
      data.price, data.compare_price || null, data.sku, data.stock,
      data.category_id || null, data.images || ['/images/prod-lavender.jpg'], data.featured || false, data.is_active !== false,
      data.weight || 0, data.volume_ml || 0, data.meta_title || data.name, data.meta_description || data.short_desc,
      id,
    ]);

    revalidatePath('/products');
    revalidatePath(`/products/${data.slug}`);
    revalidatePath('/admin/products');

    return { success: true, message: 'Product updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAdminProduct(token: string, id: number) {
  try {
    verifyAdminToken(token);
    await query(`DELETE FROM products WHERE id = $1`, [id]);

    revalidatePath('/products');
    revalidatePath('/admin/products');
    return { success: true, message: 'Product deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 3. CATEGORIES MANAGEMENT
// ----------------------------------------------------
export async function getAdminCategories(token: string) {
  try {
    verifyAdminToken(token);
    const res = await query(`
      SELECT c.id, c.name, c.slug, c.description, c.image_url, c.parent_id,
             c.sort_order, c.is_active, c.created_at,
             (SELECT COUNT(*)::int FROM products WHERE category_id = c.id) as product_count
      FROM categories c
      ORDER BY c.sort_order ASC
    `);

    return { success: true, categories: res.rows };
  } catch (err: any) {
    return { success: false, categories: [], error: err.message };
  }
}

export async function createAdminCategory(token: string, data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}) {
  try {
    verifyAdminToken(token);
    const res = await query(`
      INSERT INTO categories (name, slug, description, image_url, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id
    `, [
      data.name, data.slug, data.description || '',
      data.image_url || '/images/cat-essential-oils.jpg', data.sort_order || 0,
    ]);

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/categories');

    return { success: true, id: res.rows[0].id, message: 'Category created successfully' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAdminCategory(token: string, id: number) {
  try {
    verifyAdminToken(token);
    await query(`DELETE FROM categories WHERE id = $1`, [id]);
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/categories');
    return { success: true, message: 'Category deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 4. ORDERS & FULFILLMENT MANAGEMENT
// ----------------------------------------------------
export async function getAdminOrders(token: string, status?: string) {
  try {
    verifyAdminToken(token);

    let sql = `
      SELECT o.id, o.order_number, o.status, o.total, o.shipping_first_name, o.shipping_last_name,
             o.shipping_city, o.shipping_state, o.created_at,
             COALESCE(u.email, '') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const args: any[] = [];

    if (status && status !== 'all') {
      sql += ` WHERE o.status = $1`;
      args.push(status);
    }

    sql += ` ORDER BY o.created_at DESC`;

    const res = await query(sql, args);
    const orders = res.rows.map(o => ({
      ...o,
      total: parseFloat(o.total),
    }));

    return { success: true, orders };
  } catch (err: any) {
    return { success: false, orders: [], error: err.message };
  }
}

export async function updateAdminOrderStatus(token: string, id: number, status: string) {
  try {
    verifyAdminToken(token);
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) throw new Error('Invalid order status');

    await query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
    revalidatePath('/admin/orders');
    return { success: true, message: `Order marked as ${status}` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 5. CUSTOMERS DIRECTORY
// ----------------------------------------------------
export async function getAdminCustomers(token: string) {
  try {
    verifyAdminToken(token);
    const res = await query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
             COUNT(o.id)::int as order_count,
             COALESCE(SUM(o.total), 0)::float as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return { success: true, customers: res.rows };
  } catch (err: any) {
    return { success: false, customers: [], error: err.message };
  }
}

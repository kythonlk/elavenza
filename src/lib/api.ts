const API_URL = '';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOpts } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOpts.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOpts,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Products
export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.search) searchParams.set('search', params.search);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.order) searchParams.set('order', params.order);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchAPI<{
    products: Product[];
    total: number;
    limit: number;
    offset: number;
  }>(`/api/products${query ? `?${query}` : ''}`);
}

export async function getProduct(slug: string) {
  return fetchAPI<Product>(`/api/products/${slug}`);
}

export async function getProductReviews(slug: string) {
  return fetchAPI<Review[]>(`/api/products/${slug}/reviews`);
}

// Categories
export async function getCategories() {
  return fetchAPI<CategoryWithCount[]>('/api/categories');
}

// Auth
export async function login(email: string, password: string) {
  return fetchAPI<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  return fetchAPI<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(token: string) {
  return fetchAPI<User>('/api/auth/me', { token });
}

// Checkout
export async function createCheckoutSession(data: CheckoutRequest, token?: string) {
  return fetchAPI<{ session_id: string; url: string; order_number: string; total: number }>(
    '/api/checkout/create-session',
    { method: 'POST', body: JSON.stringify(data), token }
  );
}

// Newsletter
export async function subscribe(email: string) {
  return fetchAPI<{ message: string }>('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Reviews
export async function submitReview(slug: string, data: { rating: number; title: string; content: string }, token: string) {
  return fetchAPI<{ message: string }>(`/api/products/${slug}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

// Orders
export async function getOrders(token: string) {
  return fetchAPI<Order[]>('/api/orders', { token });
}

export async function getOrder(id: number, token: string) {
  return fetchAPI<Order>(`/api/orders/${id}`, { token });
}

// Admin
export async function getDashboardStats(token: string) {
  return fetchAPI<DashboardStats>('/api/admin/dashboard', { token });
}

export async function getAdminProducts(token: string) {
  return fetchAPI<AdminProduct[]>('/api/admin/products', { token });
}

export async function getAdminProduct(id: number, token: string) {
  return fetchAPI<Product>(`/api/admin/products/${id}`, { token });
}

export async function createProduct(data: ProductCreateRequest, token: string) {
  return fetchAPI<{ id: number; message: string }>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function updateProduct(id: number, data: ProductCreateRequest, token: string) {
  return fetchAPI<{ message: string }>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteProduct(id: number, token: string) {
  return fetchAPI<{ message: string }>(`/api/admin/products/${id}`, {
    method: 'DELETE',
    token,
  });
}

export async function getAdminOrders(token: string, status?: string) {
  const query = status ? `?status=${status}` : '';
  return fetchAPI<AdminOrder[]>(`/api/admin/orders${query}`, { token });
}

export async function updateOrderStatus(id: number, status: string, token: string) {
  return fetchAPI<{ message: string }>(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    token,
  });
}

export async function getAdminCustomers(token: string) {
  return fetchAPI<CustomerInfo[]>('/api/admin/customers', { token });
}

export async function createCategory(data: Partial<Category>, token: string) {
  return fetchAPI<{ id: number; message: string }>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function updateCategory(id: number, data: Partial<Category>, token: string) {
  return fetchAPI<{ message: string }>(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteCategory(id: number, token: string) {
  return fetchAPI<{ message: string }>(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    token,
  });
}

// Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_desc: string;
  price: number;
  compare_price: number | null;
  sku: string;
  stock: number;
  category_id: number | null;
  images: string[];
  featured: boolean;
  is_active: boolean;
  weight: number;
  volume_ml: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
  review_count: number;
  avg_rating: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  price: number;
  sku: string;
  stock: number;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CategoryWithCount extends Category {
  product_count: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Review {
  id: number;
  product_id: number;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  user_name: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_country: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CheckoutRequest {
  items: { product_id: number; variant_id?: number; quantity: number }[];
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_phone: string;
  email: string;
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_products: number;
  recent_orders: Order[];
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  sku: string;
  stock: number;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  category_name: string;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  status: string;
  total: number;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_city: string;
  shipping_state: string;
  created_at: string;
  customer_email: string;
}

export interface CustomerInfo {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export interface ProductCreateRequest {
  name: string;
  slug: string;
  description: string;
  short_desc: string;
  price: number;
  compare_price: number | null;
  sku: string;
  stock: number;
  category_id: number | null;
  images: string[];
  featured: boolean;
  is_active: boolean;
  weight: number;
  volume_ml: number;
  meta_title: string;
  meta_description: string;
}

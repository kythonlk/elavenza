'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface CartItem {
  product_id: number;
  variant_id?: number;
  name: string;
  variant_name?: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { product_id: number; variant_id?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: number; variant_id?: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map(i =>
            i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id)
        ),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            i => !(i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  subtotal: number;
  itemCount: number;
  shippingCost: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const hydrated = useRef(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('elavenza-cart'); } catch {}
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) dispatch({ type: 'LOAD_CART', payload: parsed.filter((item): item is CartItem => item && Number.isSafeInteger(item.product_id) && typeof item.name === 'string' && typeof item.slug === 'string' && Number.isFinite(item.price) && item.price >= 0 && Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) { hydrated.current = true; return; }
    try { localStorage.setItem('elavenza-cart', JSON.stringify(state.items)); } catch {}
  }, [state.items]);

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 75 ? 0 : 9.95;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const removeItem = useCallback((productId: number, variantId?: number) => dispatch({ type: 'REMOVE_ITEM', payload: { product_id: productId, variant_id: variantId } }), []);
  const updateQuantity = useCallback((productId: number, quantity: number, variantId?: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id: productId, variant_id: variantId, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const setCartOpen = useCallback((open: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: open }), []);

  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, addItem, removeItem, updateQuantity, clearCart, toggleCart, setCartOpen, subtotal, itemCount, shippingCost, tax, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

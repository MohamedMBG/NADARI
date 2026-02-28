import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartItemId: string; // unique ID for the cart row
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  prescription?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.productId === item.productId && i.variantId === item.variantId);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.cartItemId === existingItem.cartItemId 
                ? { ...i, quantity: i.quantity + item.quantity } 
                : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (cartItemId) => set((state) => ({
        items: state.items.filter(i => i.cartItemId !== cartItemId)
      })),
      updateQuantity: (cartItemId, quantity) => set((state) => ({
        items: state.items.map(i => 
          i.cartItemId === cartItemId 
            ? { ...i, quantity: Math.max(1, quantity) } 
            : i
        )
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'nadari-cart',
    }
  )
);

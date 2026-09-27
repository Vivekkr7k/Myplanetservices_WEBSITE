import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  priceINR: number;
  priceUSD: number;
  image: string;
  category: string;
  quantity: number;
  selectedKelvin?: string;
  selectedBeam?: string;
  selectedFinish?: string;
}

interface CartState {
  items: CartItem[];
  currency: 'INR' | 'USD';
  isCartOpen: boolean;
  setCurrency: (currency: 'INR' | 'USD') => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getGstAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'INR',
      isCartOpen: false,

      setCurrency: (currency) => set({ currency }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (newItem) => {
        const id = `${newItem.productId}-${newItem.selectedKelvin || 'default'}-${newItem.selectedFinish || 'default'}`;
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.id === id);

        if (existing) {
          set({
            items: currentItems.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            ),
            isCartOpen: true,
          });
        } else {
          set({
            items: [...currentItems, { ...newItem, id }],
            isCartOpen: true,
          });
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, delta) =>
        set((state) => {
          const updated = state.items
            .map((i) => {
              if (i.id === id) {
                const newQty = i.quantity + delta;
                return newQty > 0 ? { ...i, quantity: newQty } : null;
              }
              return i;
            })
            .filter(Boolean) as CartItem[];
          return { items: updated };
        }),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const { items, currency } = get();
        return items.reduce((acc, item) => {
          const price = currency === 'INR' ? item.priceINR : item.priceUSD;
          return acc + price * item.quantity;
        }, 0);
      },

      getGstAmount: () => {
        const subtotal = get().getSubtotal();
        // 18% GST standard on electrical/LED fixtures in India
        return Math.round(subtotal * 0.18);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const gst = get().getGstAmount();
        return subtotal + gst;
      },
    }),
    {
      name: 'edison-cart-storage',
    }
  )
);

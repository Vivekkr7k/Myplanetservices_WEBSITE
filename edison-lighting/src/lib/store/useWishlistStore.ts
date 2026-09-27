import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  priceINR: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
    }),
    {
      name: 'edison-wishlist-storage',
    }
  )
);

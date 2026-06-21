import { create } from 'zustand';
import type { Fruit } from '../data/fruits';

interface CartItem {
  fruit: Fruit;
  quantity: number;
}

interface AppState {
  selectedFruitId: string | null;
  setSelectedFruitId: (id: string | null) => void;
  hoveredFruitId: string | null;
  setHoveredFruitId: (id: string | null) => void;
  cart: CartItem[];
  addToCart: (fruit: Fruit, quantity: number) => void;
  removeFromCart: (fruitId: string) => void;
  updateQuantity: (fruitId: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cameraPosition: [number, number, number];
  setCameraPosition: (pos: [number, number, number]) => void;
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;
  isCameraTransitioning: boolean;
  setIsCameraTransitioning: (val: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedFruitId: null,
  setSelectedFruitId: (id) => set({ selectedFruitId: id }),
  
  hoveredFruitId: null,
  setHoveredFruitId: (id) => set({ hoveredFruitId: id }),
  
  cart: [],
  addToCart: (fruit, quantity) => set((state) => {
    const existing = state.cart.find(item => item.fruit.id === fruit.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.fruit.id === fruit.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return { cart: [...state.cart, { fruit, quantity }] };
  }),
  
  removeFromCart: (fruitId) => set((state) => ({
    cart: state.cart.filter(item => item.fruit.id !== fruitId)
  })),
  
  updateQuantity: (fruitId, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.fruit.id === fruitId ? { ...item, quantity } : item
    )
  })),
  
  isCartOpen: false,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  cameraPosition: [0, 2, 8],
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  
  cameraTarget: [0, 0, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),

  isCameraTransitioning: false,
  setIsCameraTransitioning: (val) => set({ isCameraTransitioning: val }),
}));

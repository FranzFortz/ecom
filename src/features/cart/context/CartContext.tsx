// src/features/cart/context/CartContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartItem } from "@/features/cart/types";

const STORAGE_KEY = "ecom-cart-v1";

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantKey: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantKey: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

function variantKey(variant?: CartItem["variant"]): string {
  if (!variant) return "";
  return `${variant.size ?? ""}|${variant.color ?? ""}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };
    case "ADD_ITEM": {
      const key = variantKey(action.payload.variant);
      const idx = state.items.findIndex(
        (i) =>
          i.productId === action.payload.productId &&
          variantKey(i.variant) === key
      );
      if (idx === -1) {
        return { items: [...state.items, action.payload] };
      }
      const next = [...state.items];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + action.payload.quantity,
      };
      return { items: next };
    }
    case "REMOVE_ITEM": {
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.productId === action.payload.productId &&
              variantKey(i.variant) === action.payload.variantKey
            )
        ),
      };
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity < 1) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: {
            productId: action.payload.productId,
            variantKey: action.payload.variantKey,
          },
        });
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId &&
          variantKey(i.variant) === action.payload.variantKey
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: CartItem["variant"]) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variant?: CartItem["variant"]
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadFromStorage() });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback(
    (productId: string, variant?: CartItem["variant"]) => {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { productId, variantKey: variantKey(variant) },
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variant?: CartItem["variant"]) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          productId,
          variantKey: variantKey(variant),
          quantity,
        },
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce(
      (n, i) => n + i.price * i.quantity,
      0
    );
    return {
      items: state.items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [state.items, addItem, removeItem, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

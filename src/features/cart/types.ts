// src/features/cart/types.ts
export type CartItemVariant = {
  size?: string;
  color?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: CartItemVariant;
};

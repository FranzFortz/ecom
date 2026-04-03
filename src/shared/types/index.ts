// src/shared/types/index.ts
export type PaymentMethod = "gcash" | "cash" | "card";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  sku: string;
  stock: number;
  category: string | null;
  images: string[] | null;
  variants: Json | null;
  is_featured: boolean;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: Json | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string | null;
  status: string;
  total: number;
  shipping_info: Json;
  items: Json;
  payment_method: PaymentMethod | null;
  created_at: string;
};

export type WishlistRow = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

/** Alias matching PRD / master prompt naming. */
export type WishlistItem = WishlistRow;

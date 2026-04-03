// src/features/account/hooks/useOrders.ts
import { createSupabaseServiceClient } from "@/shared/lib/supabase/service";
import type { OrderRow } from "@/shared/types";

export async function fetchOrdersForUser(userId: string): Promise<OrderRow[]> {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as OrderRow[];
  } catch {
    return [];
  }
}

import type { Json } from "@/shared/types";
import {
  DEFAULT_STOREFRONT_SETTINGS,
  parseStorefrontSettings,
  type StorefrontSettings,
} from "@/shared/types/storefront";
import { createSupabaseAnonClient } from "@/shared/lib/supabase/public";

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const supabase = createSupabaseAnonClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("settings")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return { ...DEFAULT_STOREFRONT_SETTINGS };
    }

    return parseStorefrontSettings(data.settings as Json);
  } catch {
    return { ...DEFAULT_STOREFRONT_SETTINGS };
  }
}

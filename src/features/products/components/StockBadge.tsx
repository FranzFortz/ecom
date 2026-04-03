// src/features/products/components/StockBadge.tsx
import { Badge } from "@/shared/components/ui/Badge";

export function StockBadge({ stock }: { stock: number }) {
  if (stock > 0) {
    return <Badge variant="success">In stock</Badge>;
  }
  return <Badge variant="neutral">Out of stock</Badge>;
}

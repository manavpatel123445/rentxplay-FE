import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Item } from "@/lib/types";

/**
 * Demo product illustration from /public/items until owners upload real photos (S3).
 * Pass `eager` for images visible when the page loads (Next.js 16 replaced `priority`).
 */
export function ItemImage({
  item,
  className,
  eager,
}: {
  item: Pick<Item, "id" | "title">;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-plate", className)}>
      <Image
        src={`/items/${item.id}.svg`}
        alt={item.title}
        fill
        unoptimized
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

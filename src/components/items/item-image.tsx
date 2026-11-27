import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Item } from "@/lib/types";

/** Demo product illustration from /public/items until owners upload real photos (S3). */
export function ItemImage({
  item,
  className,
  priority,
}: {
  item: Pick<Item, "id" | "title">;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-plate", className)}>
      <Image
        src={`/items/${item.id}.svg`}
        alt={item.title}
        fill
        unoptimized
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

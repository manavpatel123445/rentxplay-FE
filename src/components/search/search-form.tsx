import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const field =
  "h-12 w-full rounded-xl border border-rule bg-card px-4 text-sm text-ink placeholder:text-ink-soft focus:border-action focus:outline-none focus:ring-2 focus:ring-action/20";

/** S01 search bar. A plain GET form, so it works before any JavaScript loads. */
export function SearchForm({
  defaultQuery,
  defaultFrom,
  defaultTo,
  className,
}: {
  defaultQuery?: string;
  defaultFrom?: string;
  defaultTo?: string;
  className?: string;
}) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className={cn("grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]", className)}
    >
      <label className="sr-only" htmlFor="q">
        What do you want to rent?
      </label>
      <input
        id="q"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Try PS5, camera, drone…"
        className={field}
      />
      <label className="sr-only" htmlFor="from">
        Pickup date
      </label>
      <input id="from" name="from" type="date" defaultValue={defaultFrom} className={cn(field, "sm:w-40")} />
      <label className="sr-only" htmlFor="to">
        Return date
      </label>
      <input id="to" name="to" type="date" defaultValue={defaultTo} className={cn(field, "sm:w-40")} />
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}

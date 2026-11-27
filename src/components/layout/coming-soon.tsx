import { ButtonLink } from "@/components/ui/button";

/** Placeholder for tabs whose screens are built in a later sprint. */
export function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-ink-soft">{text}</p>
      <ButtonLink href="/search" className="mt-6">
        Browse items
      </ButtonLink>
    </div>
  );
}

import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatShortDate } from "@/lib/format";

export type ReviewCard = {
  author: string;
  rating: number;
  text: string;
  date: string;
  itemId: string;
  itemTitle: string;
};

/** Recent renter reviews, each tied to the item rented. A swipeable row on phones. */
export function RenterReviews({ reviews }: { reviews: ReviewCard[] }) {
  if (reviews.length === 0) return null;
  return (
    <RevealGroup
      list
      className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4"
    >
      {reviews.map((review) => (
        <RevealItem list key={review.author + review.date} className="grid w-[80%] shrink-0 snap-start md:w-auto">
          <figure className="flex flex-col rounded-[24px] border border-rule bg-card p-5">
            <p className="text-ink" aria-label={`${review.rating} out of 5 stars`}>
              <span aria-hidden>{"★".repeat(review.rating)}</span>
              <span aria-hidden className="text-rule">
                {"★".repeat(5 - review.rating)}
              </span>
            </p>
            <blockquote className="mt-3 flex-1 text-lg leading-snug">{review.text}</blockquote>
            <figcaption className="mt-4 border-t border-rule pt-3 text-sm">
              <span className="font-semibold">{review.author}</span>
              <span className="text-ink-soft"> rented </span>
              <Link href={`/items/${review.itemId}`} className="font-semibold text-action hover:underline">
                {review.itemTitle}
              </Link>
              <span className="block text-xs text-ink-soft">{formatShortDate(review.date)}</span>
            </figcaption>
          </figure>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

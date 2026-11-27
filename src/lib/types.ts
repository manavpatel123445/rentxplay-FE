export type CategorySlug =
  | "cameras"
  | "gaming"
  | "drones"
  | "laptops"
  | "phones"
  | "audio"
  | "projectors";

export type Category = {
  slug: CategorySlug;
  name: string;
};

/** Per-day rates by booking length (PRD business rule: tiered price). */
export type PriceTiers = {
  oneDay: number;
  threePlus: number;
  sevenPlus: number;
};

export type Review = {
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type Item = {
  id: string;
  title: string;
  category: CategorySlug;
  description: string;
  inTheBox: string[];
  condition: "Like new" | "Good" | "Fair";
  prices: PriceTiers;
  deposit: number;
  /** null = pickup only */
  deliveryFee: number | null;
  deliveryRadiusKm: number | null;
  minDays: number;
  maxDays: number;
  area: string;
  distanceKm: number;
  owner: { name: string; rating: number; rentals: number; verified: boolean; replyHours: number };
  rating: number;
  reviewCount: number;
  popular: boolean;
  /** Booked or blocked date ranges, ISO dates, inclusive. */
  unavailable: { from: string; to: string }[];
  reviews: Review[];
};

export type Handover = "pickup" | "delivery";

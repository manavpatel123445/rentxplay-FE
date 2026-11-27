/**
 * Demo data for the UI until the API exists (PRD data rule: demo data only).
 * Names and listings are fictional.
 */
import { fitsRentalLength, overlapsUnavailable, rentalDays } from "./pricing";
import type { Category, CategorySlug, Item } from "./types";

export const CITY = "Ahmedabad";

export const categories: Category[] = [
  { slug: "cameras", name: "Cameras" },
  { slug: "gaming", name: "Gaming" },
  { slug: "drones", name: "Drones" },
  { slug: "laptops", name: "Laptops" },
  { slug: "phones", name: "Phones" },
  { slug: "audio", name: "Audio" },
  { slug: "projectors", name: "Projectors" },
];

export const items: Item[] = [
  {
    id: "ps5-2-controllers",
    title: "PS5 + 2 controllers",
    category: "gaming",
    description:
      "PS5 disc edition with two DualSense controllers. Great for a weekend with friends. Games not included.",
    inTheBox: ["PS5 console", "2 DualSense controllers", "HDMI cable", "Power cable"],
    condition: "Like new",
    prices: { oneDay: 500, threePlus: 400, sevenPlus: 300 },
    deposit: 5000,
    deliveryFee: 100,
    deliveryRadiusKm: 8,
    minDays: 1,
    maxDays: 30,
    area: "Satellite",
    distanceKm: 2.1,
    owner: { name: "Aarav S.", rating: 4.9, rentals: 38, verified: true, replyHours: 1 },
    rating: 4.8,
    reviewCount: 31,
    popular: true,
    unavailable: [
      { from: "2026-12-05", to: "2026-12-07" },
      { from: "2026-12-20", to: "2026-12-24" },
    ],
    reviews: [
      { author: "Kavya M.", rating: 5, text: "Console was spotless and both controllers fully charged.", date: "2026-11-18" },
      { author: "Rohan P.", rating: 5, text: "Delivery was on time. Easy return.", date: "2026-11-02" },
    ],
  },
  {
    id: "sony-a7-iii-kit",
    title: "Sony A7 III camera kit",
    category: "cameras",
    description:
      "Full-frame mirrorless body with a 28-70mm lens, two batteries and a 128 GB card. Ideal for events and travel.",
    inTheBox: ["Sony A7 III body", "28-70mm lens", "2 batteries + charger", "128 GB SD card", "Camera bag"],
    condition: "Good",
    prices: { oneDay: 900, threePlus: 800, sevenPlus: 700 },
    deposit: 15000,
    deliveryFee: null,
    deliveryRadiusKm: null,
    minDays: 1,
    maxDays: 14,
    area: "Bodakdev",
    distanceKm: 3.4,
    owner: { name: "Neha D.", rating: 5.0, rentals: 52, verified: true, replyHours: 2 },
    rating: 4.9,
    reviewCount: 44,
    popular: true,
    unavailable: [{ from: "2026-12-12", to: "2026-12-15" }],
    reviews: [
      { author: "Ishaan T.", rating: 5, text: "Shot a full wedding on it. Owner explained every setting.", date: "2026-11-21" },
    ],
  },
  {
    id: "dji-mini-3",
    title: "DJI Mini 3 drone",
    category: "drones",
    description: "Under 249 g drone with 4K video and 3 batteries. Check local flying rules before use.",
    inTheBox: ["DJI Mini 3", "RC controller", "3 batteries", "Charging hub", "Spare propellers"],
    condition: "Like new",
    prices: { oneDay: 600, threePlus: 520, sevenPlus: 450 },
    deposit: 10000,
    deliveryFee: 150,
    deliveryRadiusKm: 10,
    minDays: 1,
    maxDays: 10,
    area: "Prahlad Nagar",
    distanceKm: 5.0,
    owner: { name: "Vikram J.", rating: 4.7, rentals: 19, verified: true, replyHours: 4 },
    rating: 4.7,
    reviewCount: 17,
    popular: false,
    unavailable: [],
    reviews: [
      { author: "Sneha R.", rating: 4, text: "Great footage. One battery drained faster than the others.", date: "2026-10-30" },
    ],
  },
  {
    id: "gopro-hero-12",
    title: "GoPro Hero 12 Black",
    category: "cameras",
    description: "Waterproof action camera with chest and helmet mounts. Perfect for treks and rides.",
    inTheBox: ["GoPro Hero 12", "2 batteries", "Chest mount", "Helmet mount", "64 GB card"],
    condition: "Good",
    prices: { oneDay: 450, threePlus: 380, sevenPlus: 300 },
    deposit: 6000,
    deliveryFee: 80,
    deliveryRadiusKm: 6,
    minDays: 1,
    maxDays: 21,
    area: "Navrangpura",
    distanceKm: 4.2,
    owner: { name: "Priya K.", rating: 4.8, rentals: 27, verified: true, replyHours: 1 },
    rating: 4.8,
    reviewCount: 22,
    popular: true,
    unavailable: [{ from: "2026-12-01", to: "2026-12-03" }],
    reviews: [],
  },
  {
    id: "macbook-air-m3",
    title: "MacBook Air M3, 16 GB",
    category: "laptops",
    description: "13-inch MacBook Air with 16 GB RAM and 512 GB storage. Freshly reset for every renter.",
    inTheBox: ["MacBook Air", "USB-C charger", "Sleeve"],
    condition: "Like new",
    prices: { oneDay: 1200, threePlus: 1000, sevenPlus: 800 },
    deposit: 25000,
    deliveryFee: 120,
    deliveryRadiusKm: 12,
    minDays: 2,
    maxDays: 30,
    area: "Vastrapur",
    distanceKm: 3.0,
    owner: { name: "Karan B.", rating: 4.9, rentals: 14, verified: true, replyHours: 3 },
    rating: 4.9,
    reviewCount: 12,
    popular: false,
    unavailable: [],
    reviews: [],
  },
  {
    id: "iphone-15-pro",
    title: "iPhone 15 Pro, 256 GB",
    category: "phones",
    description: "Unlocked iPhone 15 Pro for shoots or a backup phone. Wiped and reset after each rental.",
    inTheBox: ["iPhone 15 Pro", "USB-C cable", "Case"],
    condition: "Good",
    prices: { oneDay: 700, threePlus: 600, sevenPlus: 500 },
    deposit: 20000,
    deliveryFee: null,
    deliveryRadiusKm: null,
    minDays: 1,
    maxDays: 14,
    area: "Thaltej",
    distanceKm: 6.3,
    owner: { name: "Meera S.", rating: 4.6, rentals: 9, verified: false, replyHours: 6 },
    rating: 4.6,
    reviewCount: 7,
    popular: false,
    unavailable: [],
    reviews: [],
  },
  {
    id: "jbl-partybox-310",
    title: "JBL PartyBox 310 speaker",
    category: "audio",
    description: "Portable party speaker with lights, 18 hours of battery and a wired mic.",
    inTheBox: ["JBL PartyBox 310", "Wired microphone", "Power cable"],
    condition: "Good",
    prices: { oneDay: 650, threePlus: 550, sevenPlus: 450 },
    deposit: 7000,
    deliveryFee: 150,
    deliveryRadiusKm: 15,
    minDays: 1,
    maxDays: 7,
    area: "Maninagar",
    distanceKm: 8.7,
    owner: { name: "Harsh V.", rating: 4.7, rentals: 41, verified: true, replyHours: 2 },
    rating: 4.7,
    reviewCount: 36,
    popular: true,
    unavailable: [{ from: "2026-12-24", to: "2026-12-26" }],
    reviews: [],
  },
  {
    id: "epson-projector-screen",
    title: "Epson projector + 100\" screen",
    category: "projectors",
    description: "Full HD projector with a 100-inch tripod screen. Ready for movie nights and match screenings.",
    inTheBox: ["Epson projector", "100\" tripod screen", "HDMI cable", "Remote"],
    condition: "Good",
    prices: { oneDay: 800, threePlus: 650, sevenPlus: 500 },
    deposit: 8000,
    deliveryFee: 200,
    deliveryRadiusKm: 15,
    minDays: 1,
    maxDays: 10,
    area: "Bopal",
    distanceKm: 9.8,
    owner: { name: "Dhruv P.", rating: 4.8, rentals: 23, verified: true, replyHours: 5 },
    rating: 4.8,
    reviewCount: 19,
    popular: false,
    unavailable: [],
    reviews: [],
  },
];

export function getItem(id: string) {
  return items.find((item) => item.id === id);
}

export function categoryName(slug: CategorySlug) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

/** Neighbourhoods that have at least one item, in listing order. */
export const areas = [...new Set(items.map((item) => item.area))];

export type SearchFilters = {
  q?: string;
  category?: string;
  /** An Ahmedabad neighbourhood from `areas`. Nearby search by radius comes with the API (FR-12). */
  area?: string;
  delivery?: boolean;
  maxPrice?: number;
  sort?: "recommended" | "price" | "distance" | "rating";
  /**
   * ISO dates. When both are set, items booked in that window, or that can't be rented for that
   * many days (owner's minimum and maximum), are left out.
   */
  from?: string;
  to?: string;
};

/** Stand-in for GET /items until the API exists. */
export function searchItems(filters: SearchFilters): Item[] {
  const q = filters.q?.trim().toLowerCase();
  const result = items.filter((item) => {
    if (q && !`${item.title} ${item.description} ${item.category}`.toLowerCase().includes(q)) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.area && item.area !== filters.area) return false;
    if (filters.delivery && item.deliveryFee === null) return false;
    if (filters.maxPrice && item.prices.oneDay > filters.maxPrice) return false;
    if (filters.from && filters.to) {
      if (overlapsUnavailable(item, filters.from, filters.to)) return false;
      const days = rentalDays(filters.from, filters.to);
      if (days && !fitsRentalLength(item, days)) return false;
    }
    return true;
  });
  switch (filters.sort) {
    case "price":
      return result.toSorted((a, b) => a.prices.oneDay - b.prices.oneDay);
    case "distance":
      return result.toSorted((a, b) => a.distanceKm - b.distanceKm);
    case "rating":
      return result.toSorted((a, b) => b.rating - a.rating);
    default:
      return result.toSorted((a, b) => Number(b.popular) - Number(a.popular));
  }
}

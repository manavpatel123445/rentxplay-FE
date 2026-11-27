import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "My bookings" };

export default function BookingsPage() {
  return <ComingSoon title="My bookings" text="Your requests, upcoming and past rentals will show here once login is built." />;
}

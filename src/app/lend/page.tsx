import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Lend" };

export default function LendPage() {
  return <ComingSoon title="List your gear" text="Create listings, set prices and approve requests. Coming in the listings sprint." />;
}

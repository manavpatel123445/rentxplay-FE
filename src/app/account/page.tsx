import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return <ComingSoon title="Account" text="Log in, profile and verification arrive with the auth sprint." />;
}

import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import { TabBar } from "@/components/layout/nav-links";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const googleSans = Google_Sans_Flex({
  variable: "--font-gsans",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "wdth", "ROND"],
});

export const metadata: Metadata = {
  title: {
    default: "GearLoop — Rent gadgets from people near you",
    template: "%s · GearLoop",
  },
  description:
    "Rent cameras, consoles, drones and more from verified owners in Ahmedabad. Pay per day, get your deposit back on return.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${googleSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <TabBar />
      </body>
    </html>
  );
}

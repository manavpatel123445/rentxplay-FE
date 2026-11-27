import { Suspense, type ReactNode } from "react";
import { AuthPreviewProvider } from "@/components/auth/auth-preview";
import { AuthSwitch, AuthSwitchFallback } from "@/components/auth/auth-switch";
import { Pegboard, type PegItem } from "@/components/auth/pegboard";
import { items } from "@/lib/mock-data";

/** Shared by log in and sign up, so the switch and the pegboard stay put while the form changes. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const pegItems: PegItem[] = ["sony-a7-iii-kit", "ps5-2-controllers", "dji-mini-3"].flatMap((id) => {
    const item = items.find((i) => i.id === id);
    return item ? [{ id: item.id, title: item.title, dayPrice: item.prices.oneDay }] : [];
  });

  return (
    <AuthPreviewProvider>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:py-5">
        <div className="flex flex-col justify-center px-1 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            <Suspense fallback={<AuthSwitchFallback />}>
              <AuthSwitch />
            </Suspense>
            {children}
          </div>
        </div>
        <Pegboard items={pegItems} />
      </div>
    </AuthPreviewProvider>
  );
}

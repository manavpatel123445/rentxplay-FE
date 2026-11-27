import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, DemoNote } from "@/components/auth/auth-heading";
import { FormSkeleton } from "@/components/auth/form-skeleton";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/validate";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <>
      <AuthHeading title="Welcome back" intro="Log in to request items, pay and track your rentals." />
      <Suspense fallback={<FormSkeleton fields={2} />}>
        <Gate searchParams={props.searchParams} />
      </Suspense>
      <DemoNote />
    </>
  );
}

/** Already logged in: go straight on. Otherwise show the form, carrying ?next through. */
async function Gate({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const [user, params] = await Promise.all([getSession(), searchParams]);
  const next = safeNext(params.next);
  if (user) redirect(next);
  return <LoginForm next={next} />;
}

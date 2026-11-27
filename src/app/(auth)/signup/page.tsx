import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, DemoNote } from "@/components/auth/auth-heading";
import { FormSkeleton } from "@/components/auth/form-skeleton";
import { SignupForm } from "@/components/auth/signup-form";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/validate";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function SignupPage(props: PageProps<"/signup">) {
  return (
    <>
      <AuthHeading title="Create your account" intro="Rent from people near you in Ahmedabad, or lend what you own." />
      <Suspense fallback={<FormSkeleton fields={4} />}>
        <Gate searchParams={props.searchParams} />
      </Suspense>
      <DemoNote />
    </>
  );
}

async function Gate({ searchParams }: { searchParams: PageProps<"/signup">["searchParams"] }) {
  const [user, params] = await Promise.all([getSession(), searchParams]);
  const next = safeNext(params.next);
  if (user) redirect(next);
  return <SignupForm next={next} />;
}

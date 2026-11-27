/** Page title and one line on what logging in or signing up lets you do. */
export function AuthHeading({ title, intro }: { title: string; intro: string }) {
  return (
    <>
      <h1 className="type-condensed mt-8 text-5xl leading-[0.95] font-extrabold tracking-tight md:text-6xl">{title}</h1>
      <p className="mt-3 text-lg text-ink-soft">{intro}</p>
    </>
  );
}

/** Says plainly that accounts are not real yet, without competing with the form. */
export function DemoNote() {
  return (
    <p className="mt-5 flex gap-2 text-sm text-ink-soft">
      <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5M12 7.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>
        <strong className="font-semibold text-ink">Demo mode.</strong> Any valid details sign you in on this device.
        Nothing is saved until the GearLoop API is live.
      </span>
    </p>
  );
}

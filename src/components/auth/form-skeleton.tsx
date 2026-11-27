/** Loading state for the auth forms while the session check streams in. */
export function FormSkeleton({ fields }: { fields: number }) {
  return (
    <div aria-busy="true" aria-label="Loading form" className="mt-8 space-y-5">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i}>
          <div className="h-4 w-24 rounded bg-plate" />
          <div className="mt-1.5 h-14 animate-pulse rounded-2xl bg-plate motion-reduce:animate-none" />
        </div>
      ))}
      <div className="h-13 animate-pulse rounded-full bg-plate motion-reduce:animate-none" />
    </div>
  );
}

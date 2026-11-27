"use client";

import { createContext, use, useState, type ReactNode } from "react";

type Preview = { email: string };
type PreviewContext = Preview & { update: (changes: Partial<Preview>) => void };

const Context = createContext<PreviewContext | null>(null);

/** Shares what the person types with the yellow tag on the pegboard, so the tag fills in live. */
export function AuthPreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<Preview>({ email: "" });
  return (
    <Context value={{ ...preview, update: (changes) => setPreview((p) => ({ ...p, ...changes })) }}>
      {children}
    </Context>
  );
}

export function useAuthPreview() {
  const value = use(Context);
  if (!value) throw new Error("useAuthPreview must be used inside AuthPreviewProvider");
  return value;
}

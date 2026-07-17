import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
      {title ? (
        <div className="border-b border-[color:var(--border)] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

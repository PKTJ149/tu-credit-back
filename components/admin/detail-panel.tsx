import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PanelProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Removes body padding when the panel holds a table or list that should
   *  run edge to edge. */
  flush?: boolean;
};

/** The single surface container for the back office. Cards are not nested;
 *  a panel never contains another panel. */
export function Panel({ title, description, actions, children, className, flush }: PanelProps) {
  return (
    <section className={cn("rounded-xl border border-[var(--border)] bg-[var(--background)]", className)}>
      {title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-[var(--border)] px-5 py-3.5">
          <div className="min-w-0 space-y-0.5">
            {title ? <h2 className="text-sm font-semibold">{title}</h2> : null}
            {description ? (
              <p className="max-w-[62ch] text-xs leading-5 text-[var(--ink-muted)]">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={flush ? "" : "px-5 py-4"}>{children}</div>
    </section>
  );
}

export type DetailRow = {
  label: string;
  value: ReactNode;
  /** Spans both columns — for notes, reasons, and anything with prose in it. */
  full?: boolean;
};

/** Label/value pairs on detail screens. Uses a real <dl> so screen readers
 *  announce the pairing rather than reading two loose columns of text. */
export function DetailList({ rows, className }: { rows: DetailRow[]; className?: string }) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3.5 sm:grid-cols-2", className)}>
      {rows.map((row) => (
        <div key={row.label} className={cn("min-w-0 space-y-1", row.full && "sm:col-span-2")}>
          <dt className="text-xs font-medium text-[var(--ink-subtle)]">{row.label}</dt>
          <dd className="text-sm leading-6 break-words text-pretty">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

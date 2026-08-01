import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Column<T> = {
  /** Stable key — also used as the React key for cells. */
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Right-align numeric columns so digits line up down the page. */
  align?: "start" | "end";
  /** Tailwind width utility, e.g. "w-40". Omit to let content decide. */
  width?: string;
  /** Hide below `md` when the column is secondary on narrow screens. */
  hideOnMobile?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Makes the whole row a link. The last cell gets a chevron affordance. */
  rowHref?: (row: T) => string;
  /** Shown in place of the table body when there are no rows. */
  empty: ReactNode;
  caption?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowHref,
  empty,
  caption,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--background)]", className)}>{empty}</div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)]",
        className,
      )}
    >
      <table className="w-full border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-strong)]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-[var(--ink-muted)]",
                  col.align === "end" ? "text-end" : "text-start",
                  col.width,
                  col.hideOnMobile && "hidden md:table-cell",
                )}
              >
                {col.header}
              </th>
            ))}
            {rowHref ? <th scope="col" className="w-10 px-2" aria-label="เปิดรายละเอียด" /> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            return (
              <tr
                key={rowKey(row)}
                className={cn(
                  "border-b border-[var(--border)] transition-colors last:border-b-0",
                  href && "hover:bg-[var(--surface)] focus-within:bg-[var(--surface)]",
                )}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 align-middle",
                      col.align === "end" ? "text-end" : "text-start",
                      col.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {/* The link wraps the first cell only. A stretched link over
                        the whole row would swallow buttons in later cells, and
                        rows here routinely carry approve/reject actions. */}
                    {href && i === 0 ? (
                      <Link
                        href={href}
                        className="-mx-1 inline-block rounded px-1 py-0.5 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        {col.cell(row)}
                      </Link>
                    ) : (
                      col.cell(row)
                    )}
                  </td>
                ))}
                {href ? (
                  <td className="w-10 px-2 text-end">
                    <ChevronRight className="ms-auto size-4 text-[var(--ink-subtle)]" aria-hidden />
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Rendered while a table's data is in flight. Matches row height so the
 *  layout does not jump when real rows arrive. */
export function DataTableSkeleton({ columns = 5, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
      <div className="h-10 border-b border-[var(--border)] bg-[var(--surface-strong)]" />
      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((__, c) => (
              <div
                key={c}
                className="h-4 flex-1 animate-pulse rounded bg-[color:color-mix(in_oklch,var(--muted)_70%,white)]"
                style={{ maxWidth: c === 0 ? "22%" : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">กำลังโหลดข้อมูล</span>
    </div>
  );
}

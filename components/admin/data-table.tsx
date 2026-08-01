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
  /**
   * Clamp a long value to one line with an ellipsis, e.g. "max-w-[26ch]".
   *
   * Thai program and subject names run long, and left to themselves they wrap
   * to three lines and triple the height of every row — a 12-row queue then
   * needs four screens. Cells default to one line; this is how a column that
   * cannot fit gets truncated instead of growing the row.
   */
  truncate?: string;
  /**
   * Opt out of single-line layout for a column that genuinely needs to wrap
   * (a note, a reason). Costs row height, so it should be rare.
   */
  wrap?: boolean;
  /**
   * Pin the column to the right edge so it stays visible while the rest of the
   * table scrolls under it. For the action column on a wide table: an officer
   * should never have to scroll sideways to find the only control on the row.
   * Use on the last column only.
   */
  stickyEnd?: boolean;
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
                  col.stickyEnd &&
                    "sticky end-0 z-10 bg-[var(--surface-strong)] before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-[var(--border)] before:content-['']",
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
                  "group/row border-b border-[var(--border)] transition-colors last:border-b-0",
                  href && "hover:bg-[var(--surface)] focus-within:bg-[var(--surface)]",
                )}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 align-middle",
                      // One line by default. Wrapping is the opt-in, not the
                      // default, because row height is the scarce resource on
                      // every screen a staff member works a queue from.
                      col.wrap ? "whitespace-normal" : "whitespace-nowrap",
                      col.align === "end" ? "text-end" : "text-start",
                      col.hideOnMobile && "hidden md:table-cell",
                      col.stickyEnd &&
                        "sticky end-0 z-10 bg-[var(--background)] before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-[var(--border)] before:content-[''] group-hover/row:bg-[var(--surface)]",
                    )}
                  >
                    {/* The link wraps the first cell only. A stretched link over
                        the whole row would swallow buttons in later cells, and
                        rows here routinely carry approve/reject actions. */}
                    {href && i === 0 ? (
                      <Link
                        href={href}
                        className={cn(
                          "-mx-1 rounded px-1 py-0.5 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          col.truncate ? cn("block truncate", col.truncate) : "inline-block",
                        )}
                      >
                        {col.cell(row)}
                      </Link>
                    ) : col.truncate ? (
                      <span className={cn("block truncate", col.truncate)}>{col.cell(row)}</span>
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

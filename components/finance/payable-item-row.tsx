import Link from "next/link";
import { StatusBadge } from "@/components/finance/status-badge";
import { formatTHB, type PayableItem } from "@/lib/finance/payment-state";

type PayableItemRowProps = {
  item: PayableItem;
  actionLabel?: string;
  actionHref?: string;
};

export function PayableItemRow({ item, actionLabel, actionHref }: PayableItemRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[color:var(--border)] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
        {item.dueDate ? (
          <p className="mt-0.5 text-xs text-[var(--ink-subtle)]">ครบกำหนด {item.dueDate}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="font-mono text-sm font-medium text-[var(--foreground)]">
          {formatTHB(item.amount)}
        </span>
        <StatusBadge state={item.state} />
        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex h-8 items-center rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-3 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

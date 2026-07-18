import Link from "next/link";
import { TransferStatusBadge } from "@/components/credit-transfer/transfer-status-badge";
import type { TransferRequest } from "@/lib/credit-transfer/transfer-state";

type RequestRowProps = {
  request: TransferRequest;
  actionLabel?: string;
  actionHref?: string;
};

export function RequestRow({ request, actionLabel, actionHref }: RequestRowProps) {
  const typeLabel = request.type === "in" ? "เทียบโอนเข้า" : "เทียบโอนออก";

  return (
    <div className="flex flex-col gap-3 border-b border-[color:var(--border)] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.title}</p>
        <p className="mt-0.5 text-xs text-[var(--ink-subtle)]">
          {typeLabel} · ส่งเมื่อ {request.submittedDate}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <TransferStatusBadge state={request.state} />
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

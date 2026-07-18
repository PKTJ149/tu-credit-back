import Link from "next/link";
import { RegistrationStatusBadge } from "@/components/learning/registration-status-badge";
import type { Registration } from "@/lib/learning/registration-status";

type RegistrationRowProps = {
  registration: Registration;
  actionLabel?: string;
  actionHref?: string;
};

export function RegistrationRow({ registration, actionLabel, actionHref }: RegistrationRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[color:var(--border)] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
          {registration.itemName}
        </p>
        <p className="mt-0.5 text-xs text-[var(--ink-subtle)]">{registration.term}</p>
      </div>

      <div className="flex items-center gap-3">
        <RegistrationStatusBadge status={registration.status} />
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

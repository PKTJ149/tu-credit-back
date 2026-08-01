import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  /** One sentence on what this screen is for. Skip it when the title is enough. */
  description?: string;
  crumbs?: Crumb[];
  /** Back affordance for detail screens; breadcrumbs alone are a weak target. */
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  crumbs,
  backHref,
  backLabel = "ย้อนกลับ",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-1 rounded-md py-1 text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {backLabel}
        </Link>
      ) : null}

      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="เส้นทางหน้า">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--ink-subtle)]">
            {crumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-[var(--ink-muted)]">
                    {crumb.label}
                  </span>
                )}
                {i < crumbs.length - 1 ? <span aria-hidden>/</span> : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-balance">{title}</h1>
          {description ? (
            <p className="max-w-[70ch] text-sm leading-6 text-[var(--ink-muted)] text-pretty">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

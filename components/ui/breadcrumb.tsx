import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        href="/"
        className="flex items-center text-[var(--ink-subtle)] transition-colors hover:text-[var(--foreground)]"
      >
        <Home aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only">หน้าหลัก</span>
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-[color:var(--border)] shrink-0"
            />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[var(--ink-subtle)] transition-colors hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-medium text-[var(--foreground)] truncate max-w-[240px]"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

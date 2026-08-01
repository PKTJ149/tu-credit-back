"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { activeHref, navGroupsForRole } from "@/lib/admin/nav";
import type { StaffRole } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export function AdminNav({ role, onNavigate }: { role: StaffRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = activeHref(pathname);
  const groups = navGroupsForRole(role);

  return (
    <nav aria-label="เมนูระบบหลังบ้าน" className="flex flex-col gap-5 px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-2.5 pb-0.5 text-[11px] font-semibold text-[color:color-mix(in_oklch,var(--sidebar-foreground)_58%,transparent)]">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isCurrent = current === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
                      isCurrent
                        ? "bg-[var(--sidebar-primary)] font-medium text-[var(--sidebar-primary-foreground)]"
                        : "text-[color:color-mix(in_oklch,var(--sidebar-foreground)_82%,transparent)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.upcoming ? (
                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                          isCurrent
                            ? "bg-white/20 text-[var(--sidebar-primary-foreground)]"
                            : "bg-[var(--sidebar-accent)] text-[color:color-mix(in_oklch,var(--sidebar-foreground)_70%,transparent)]",
                        )}
                      >
                        เร็วๆ นี้
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

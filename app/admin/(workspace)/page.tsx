"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { navGroupsForRole } from "@/lib/admin/nav";
import { useStaffSession } from "@/lib/admin/staff-session";
import { staffRoleInfo } from "@/lib/admin/types";

/**
 * Placeholder landing. The role-scoped dashboards with real counts and
 * ageing are phase 4 — they summarise screens that do not exist yet, and a
 * summary built before the thing it summarises invents its own numbers.
 *
 * Until then this does the one useful thing a landing can do on day one:
 * show what this role can reach.
 */
export default function AdminHomePage() {
  const { staff, role } = useStaffSession();
  if (!staff || !role) return null;

  const groups = navGroupsForRole(role).filter((g) => g.label !== "ภาพรวม");

  return (
    <>
      <PageHeader
        title={`สวัสดี ${staff.name}`}
        description={`คุณเข้าใช้งานในบทบาท${staffRoleInfo[role].label} — ${staffRoleInfo[role].description}`}
      />

      <Panel
        title="หน้าหลักแบบเต็มจะมาในเฟสถัดไป"
        description="แดชบอร์ดที่สรุปงานค้าง ยอดเงิน และคำขอที่ใกล้ครบกำหนด จะสร้างหลังจากหน้าจอที่มันสรุปเสร็จแล้ว"
      >
        <p className="flex items-start gap-2 text-sm leading-6 text-[var(--ink-muted)]">
          <Compass className="mt-0.5 size-4 shrink-0" aria-hidden />
          ระหว่างนี้เลือกงานที่ต้องการจากรายการด้านล่าง หรือใช้เมนูด้านซ้าย
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Panel key={group.label} title={group.label} flush>
            <ul className="divide-y divide-[var(--border)]">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
                    >
                      <Icon className="size-4 shrink-0 text-[var(--ink-subtle)]" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-sm">{item.label}</span>
                      {item.upcoming ? (
                        <span className="shrink-0 rounded bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-subtle)]">
                          เร็วๆ นี้
                        </span>
                      ) : (
                        <ArrowRight
                          className="size-4 shrink-0 text-[var(--ink-subtle)] transition-transform duration-150 group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>
        ))}
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const SEGMENT_LABELS: Record<string, string> = {
  programs: "หลักสูตร",
  subjects: "รายวิชา",
  news: "ข่าวสาร",
  about: "เกี่ยวกับ",
  help: "ช่วยเหลือ",
  profile: "โปรไฟล์ของฉัน",
  "change-password": "เปลี่ยนรหัสผ่าน",
  settings: "ตั้งค่า",
  learning: "เป้าหมายการเรียนรู้",
  registrations: "การลงทะเบียน",
  transfer: "เทียบโอนหน่วยกิต",
  finance: "การเงิน",
  academic: "ผลการเรียน",
  "academic-progress": "ผลการเรียน",
  documents: "เอกสาร",
  dashboard: "แดชบอร์ด",
  login: "เข้าสู่ระบบ",
  register: "สมัครสมาชิก",
  confirm: "ยืนยันอีเมล",
};

const HIDDEN_SEGMENTS = new Set(["member"]);

function useAutoItems(): BreadcrumbItem[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments
    .map((seg, i) => ({
      label: SEGMENT_LABELS[seg] ?? seg,
      href: "/" + segments.slice(0, i + 1).join("/"),
    }))
    .filter((_, i) => !HIDDEN_SEGMENTS.has(segments[i]));
}

/**
 * Unified breadcrumb component.
 *
 * - Pass `items` for explicit crumbs (detail pages, list pages).
 * - Omit `items` to auto-generate from the current URL path (page shells).
 */
export function Breadcrumb({ items }: { items?: BreadcrumbItem[] }) {
  const pathname = usePathname();
  const autoItems = useAutoItems();

  if (!items && pathname === "/") return null;

  const crumbs = items ?? autoItems;

  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
      <Link
        href="/"
        className="flex items-center text-[var(--ink-subtle)] transition-colors hover:text-[var(--foreground)]"
      >
        <Home aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only">หน้าหลัก</span>
      </Link>
      {crumbs.map((item, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-[color:var(--border)]"
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
                aria-current={isLast ? "page" : undefined}
                className="max-w-[240px] truncate font-medium text-[var(--foreground)]"
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

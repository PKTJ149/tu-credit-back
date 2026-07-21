"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

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
};

export function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "หน้าหลัก", href: "/" },
    ...segments.map((seg, i) => ({
      label: SEGMENT_LABELS[seg] ?? seg,
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav
      aria-label="breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-0.5 text-sm"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-0.5">
            {i > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="mx-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--border)]"
              />
            )}
            {isLast ? (
              <span
                aria-current="page"
                className="font-medium text-[var(--foreground)]"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[var(--ink-subtle)] transition hover:text-[var(--foreground)]"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

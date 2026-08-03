import Link from "next/link";
import Image from "next/image";
import {
  CircleHelp,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type SidebarStat = { label: string; value: string };

type AuthPageShellProps = {
  badge: string;
  title: string;
  description: string;
  panelBadge: string;
  panelTitle: string;
  panelDescription: string;
  currentStep?: "sign-in" | "register" | "verify" | "profile" | "ready";
  hideSteps?: boolean;
  size?: "standard" | "wide";
  hideSidebar?: boolean;
  sidebarStats?: SidebarStat[];
  sidebarPoints?: string[];
  children: ReactNode;
};

const supportPoints = [
  "ใช้บัญชีเดียวสำหรับการลงทะเบียน การเงิน และติดตามความก้าวหน้าการเรียน",
  "กรอกเฉพาะข้อมูลโปรไฟล์ที่จำเป็นก่อนเริ่มใช้งานส่วนที่ต้องยืนยันตัวตน",
  "ไปต่อทีละขั้น พร้อมสถานะและทางแก้ไขที่ชัดเจน",
];

const supportStats = [
  { label: "ระบบ", value: "Credit Bank มธ." },
  { label: "ขั้นตอนถัดไป", value: "ยืนยันความพร้อมของโปรไฟล์" },
  { label: "ช่องทางช่วยเหลือ", value: "บริการผู้เรียน มธ." },
];

export function AuthPageShell({
  badge,
  title,
  description,
  panelBadge,
  panelTitle,
  panelDescription,
  size = "standard",
  hideSidebar = false,
  sidebarStats,
  sidebarPoints,
  children,
}: AuthPageShellProps) {
  const resolvedStats = sidebarStats ?? supportStats;
  const resolvedPoints = sidebarPoints ?? supportPoints;
  const contentMaxWidth = size === "wide" ? "max-w-7xl" : "max-w-6xl";
  const workspaceColumns =
    size === "wide"
      ? "lg:grid-cols-[18rem_minmax(0,1fr)]"
      : "lg:grid-cols-[20rem_minmax(0,34rem)]";

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            {/* The mark is the TUCBS logo itself. No background tint behind it —
                the artwork carries its own colour, and the institutional red
                square would fight it. `object-contain` keeps the 2.5:1 emblem
                undistorted inside the square box. */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <Image
                src="/images/tucbs-logo-trimmed.png"
                alt="TUCBS"
                width={830}
                height={334}
                priority
                className="h-auto w-full object-contain"
              />
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--ink-subtle)]">
                Thammasat University
              </p>
              <p className="text-base font-semibold text-[var(--foreground)]">
                Credit Bank System (TUCBS)
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--ink-muted)] md:flex">
            {[
              { label: "หน้าหลัก", href: "/" },
              { label: "หลักสูตร", href: "/programs" },
              { label: "รายวิชา", href: "/subjects" },
              { label: "เกี่ยวกับ", href: "/about" },
              { label: "ข่าวสาร", href: "/news" },
              { label: "ช่วยเหลือ", href: "/help" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] sm:inline-flex"
            >
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="ui-button-primary h-10 px-4 text-sm">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className={`mx-auto w-full ${contentMaxWidth} px-4 py-6 sm:px-6 lg:px-8 lg:py-8`}>
        <Breadcrumb />

        <div className={`grid gap-6 ${hideSidebar ? "" : workspaceColumns}`}>
          {!hideSidebar && <aside className="space-y-4">
            <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_55%,white)] text-[var(--secondary-foreground)]">
                <Landmark aria-hidden="true" className="h-5 w-5" />
              </div>
              <p className="mb-3 text-sm font-medium text-[var(--primary)]">
                {badge}
              </p>
              <h1 className="text-2xl font-semibold leading-9 text-balance text-[var(--foreground)]">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">
                {description}
              </p>
            </section>

            <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  ความพร้อมของบัญชี
                </h2>
              </div>
              <dl className="space-y-4">
                {resolvedStats.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-medium text-[var(--ink-subtle)]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)] p-5">
              <div className="mb-4 flex items-center gap-3">
                <CircleHelp aria-hidden="true" className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  หมายเหตุจากทีมสนับสนุน มธ.
                </h2>
              </div>
              <ul className="space-y-3">
                {resolvedPoints.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--ink-muted)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </aside>}

          <section className="min-w-0">
            <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
              <div className="border-b border-[color:var(--border)] px-5 py-5 sm:px-6">
                <p className="text-sm font-medium text-[var(--primary)]">
                  {panelBadge}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                  {panelTitle}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-muted)]">
                  {panelDescription}
                </p>
              </div>

              <div className="p-5 sm:p-6">{children}</div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[color:var(--border)] bg-[var(--background)]">
        <div className={`mx-auto flex w-full ${contentMaxWidth} flex-col gap-4 px-4 py-5 text-sm text-[var(--ink-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8`}>
          <p>ต้นแบบ Thammasat University Credit Bank System (TUCBS)</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#help" id="help" className="transition hover:text-[var(--foreground)]">
              ช่วยเหลือ
            </a>
            <a href="#privacy" className="transition hover:text-[var(--foreground)]">
              นโยบายความเป็นส่วนตัว
            </a>
            <a href="#terms" className="transition hover:text-[var(--foreground)]">
              เงื่อนไขการใช้งาน
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

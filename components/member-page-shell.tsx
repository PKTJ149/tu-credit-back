import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type MemberNavItem =
  | "home"
  | "dashboard"
  | "learning"
  | "programs"
  | "subjects"
  | "registrations"
  | "finance"
  | "documents"
  | "academic"
  | "transfer"
  | "account";

type MemberPageShellProps = {
  title: string;
  description?: string;
  currentNav?: MemberNavItem;
  children: ReactNode;
  fullBleed?: boolean;
  showBreadcrumb?: boolean;
  /** Custom breadcrumb to render above the title, in place of the auto-generated one. */
  breadcrumb?: ReactNode;
};

const memberNavItems = [
  { label: "หน้าหลัก", href: "/" },
  { label: "หลักสูตร", href: "/member/programs" },
  { label: "รายวิชา", href: "/member/subjects" },
  { label: "ข่าวสาร", href: "/news" },
  { label: "เกี่ยวกับ", href: "/about" },
  { label: "ช่วยเหลือ", href: "/help" },
];

export function MemberPageShell({
  title,
  description,
  children,
  fullBleed = false,
  showBreadcrumb = true,
  breadcrumb,
}: MemberPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      <header className="border-b border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
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
              <p className="text-[13px] font-medium text-[var(--ink-subtle)]">
                Thammasat University
              </p>
              <p className="text-base font-semibold text-[var(--foreground)]">
                Credit Bank System (TUCBS)
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="เมนูหลัก"
            className="hidden items-center gap-6 text-sm font-medium text-[var(--ink-muted)] lg:flex"
          >
            {memberNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Profile dropdown */}
          <ProfileDropdown />
        </div>

        {/* Mobile nav */}
        <nav
          aria-label="เมนูหลัก (มือถือ)"
          className="flex items-center gap-1 overflow-x-auto border-t border-[color:var(--border)] px-4 py-2 lg:hidden"
        >
          {memberNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {fullBleed ? (
        <main id="main-content" className="flex flex-1">
          {children}
        </main>
      ) : (
        <main
          id="main-content"
          className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {breadcrumb !== undefined ? breadcrumb : showBreadcrumb && <Breadcrumb />}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm leading-7 text-[var(--ink-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </main>
      )}

      <footer className="border-t border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-[var(--ink-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>ต้นแบบ Thammasat University Credit Bank System (TUCBS)</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/help" className="transition hover:text-[var(--foreground)]">
              ช่วยเหลือ
            </Link>
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

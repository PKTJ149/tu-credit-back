import Link from "next/link";
import type { ReactNode } from "react";

type PublicPageShellProps = {
  children: ReactNode;
};

const publicNavItems = [
  { label: "หลักสูตร", href: "/programs" },
  { label: "รายวิชา", href: "/subjects" },
  { label: "เกี่ยวกับ", href: "/about" },
  { label: "ข่าวสาร", href: "/news" },
  { label: "ช่วยเหลือ", href: "/help" },
];

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
              CB
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--ink-subtle)]">
                มหาวิทยาลัยธรรมศาสตร์
              </p>
              <p className="text-base font-semibold text-[var(--foreground)]">
                Credit Bank
              </p>
            </div>
          </Link>

          <nav
            aria-label="เมนูหลัก"
            className="hidden items-center gap-6 text-sm font-medium text-[var(--ink-muted)] md:flex"
          >
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[var(--foreground)]"
              >
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

        <nav
          aria-label="เมนูหลัก (มือถือ)"
          className="flex items-center gap-1 overflow-x-auto border-t border-[color:var(--border)] px-4 py-2 md:hidden"
        >
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-[var(--ink-muted)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-[var(--primary)]"
          >
            เข้าสู่ระบบ
          </Link>
        </nav>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {children}
      </main>

      <footer className="border-t border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-[var(--ink-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Credit Bank มหาวิทยาลัยธรรมศาสตร์</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/help" className="transition hover:text-[var(--foreground)]">
              ช่วยเหลือ
            </Link>
            <Link href="/about" className="transition hover:text-[var(--foreground)]">
              เกี่ยวกับ
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

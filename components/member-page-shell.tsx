import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  ClipboardList,
  Wallet,
  FileText,
  GraduationCap,
  LibraryBig,
  ArrowLeftRight,
} from "lucide-react";
import type { ReactNode } from "react";

type MemberNavItem =
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
  currentNav: MemberNavItem;
  children: ReactNode;
};

const navItems: { id: MemberNavItem; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
  { id: "learning", label: "เป้าหมายการเรียนรู้", href: "/learning", icon: Compass },
  { id: "programs", label: "หลักสูตร", href: "/member/programs", icon: LibraryBig },
  { id: "subjects", label: "รายวิชา", href: "/member/subjects", icon: BookOpen },
  { id: "registrations", label: "การลงทะเบียน", href: "/registrations", icon: ClipboardList },
  { id: "transfer", label: "เทียบโอนหน่วยกิต", href: "/transfer", icon: ArrowLeftRight },
  { id: "finance", label: "การเงิน", href: "/finance", icon: Wallet },
  { id: "academic", label: "ผลการเรียน", href: "/academic-progress", icon: GraduationCap },
  { id: "documents", label: "เอกสาร", href: "/finance/documents", icon: FileText },
];

export function MemberPageShell({
  title,
  description,
  currentNav,
  children,
}: MemberPageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
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
          </div>

          <Link
            href="/profile"
            aria-label="โปรไฟล์ของฉัน"
            aria-current={currentNav === "account" ? "page" : undefined}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_45%,white)] text-sm font-semibold text-[var(--secondary-foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            นศ
          </Link>
        </div>

        <nav
          aria-label="เมนูสมาชิก"
          className="flex items-center gap-1 overflow-x-auto border-t border-[color:var(--border)] px-4 py-2 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex w-full max-w-7xl items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentNav;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--ink-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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

      <footer className="border-t border-[color:var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-[var(--ink-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>ต้นแบบระบบ Credit Bank มหาวิทยาลัยธรรมศาสตร์</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#help" className="transition hover:text-[var(--foreground)]">
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  ClipboardList,
  ArrowLeftRight,
  Wallet,
  GraduationCap,
  FileText,
  User,
  KeyRound,
  Settings,
  LogOut,
} from "lucide-react";

const accountMenus = [
  { icon: User, label: "ข้อมูลส่วนตัว", href: "/profile" },
  { icon: KeyRound, label: "เปลี่ยนรหัสผ่าน", href: "/profile/change-password" },
  { icon: Settings, label: "ตั้งค่า", href: "/profile/settings" },
];

const activityMenus = [
  { icon: Compass, label: "เป้าหมายการเรียนรู้", href: "/profile/learning" },
  { icon: ClipboardList, label: "การลงทะเบียน", href: "/profile/registrations" },
  { icon: ArrowLeftRight, label: "เทียบโอนหน่วยกิต", href: "/profile/transfer" },
  { icon: Wallet, label: "การเงิน", href: "/profile/finance" },
  { icon: GraduationCap, label: "ผลการเรียน", href: "/profile/academic" },
  { icon: FileText, label: "เอกสาร", href: "/profile/documents" },
];

function useIsActive(href: string) {
  const pathname = usePathname();
  if (href === "/profile") return pathname === "/profile";
  return pathname.startsWith(href);
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const active = useIsActive(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
        active
          ? "bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[var(--primary)]"
          : "text-[var(--ink-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
      }`}
    >
      <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
      {label}
    </Link>
  );
}

export function ProfileSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 self-stretch lg:flex lg:flex-col">
      <div className="flex flex-1 flex-col">

        {/* บัญชีของฉัน */}
        <div className="mb-6">
          <p className="mb-1 px-3 text-xs font-semibold text-[var(--ink-subtle)]">
            บัญชีของฉัน
          </p>
          <nav aria-label="เมนูบัญชี" className="space-y-0.5">
            {accountMenus.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </nav>
        </div>

        {/* กิจกรรมของฉัน */}
        <div>
          <p className="mb-1 px-3 text-xs font-semibold text-[var(--ink-subtle)]">
            กิจกรรมของฉัน
          </p>
          <nav aria-label="เมนูกิจกรรม" className="space-y-0.5">
            {activityMenus.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </nav>
        </div>

        {/* Push logout to bottom */}
        <div className="flex-1" />

        {/* Logout — clearly separated */}
        <div className="mt-6 border-t border-[color:var(--border)] pt-4">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--ink-subtle)] transition hover:text-[var(--destructive)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            <LogOut aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
            ออกจากระบบ
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function ProfileMobileTabs() {
  const pathname = usePathname();
  const allMenus = [...accountMenus, ...activityMenus];

  function isActive(href: string) {
    if (href === "/profile") return pathname === "/profile";
    return pathname.startsWith(href);
  }

  return (
    <div className="-mx-4 mb-6 overflow-x-auto border-b border-[color:var(--border)] px-4 pb-3 lg:hidden">
      <div className="flex gap-1">
        {allMenus.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--background)] text-[var(--primary)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

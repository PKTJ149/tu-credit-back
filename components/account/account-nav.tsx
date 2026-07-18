import Link from "next/link";
import { User, KeyRound, Settings as SettingsIcon } from "lucide-react";

type AccountTab = "profile" | "password" | "settings";

const tabs: { id: AccountTab; label: string; href: string; icon: typeof User }[] = [
  { id: "profile", label: "โปรไฟล์", href: "/profile", icon: User },
  { id: "password", label: "เปลี่ยนรหัสผ่าน", href: "/change-password", icon: KeyRound },
  { id: "settings", label: "ตั้งค่า", href: "/settings", icon: SettingsIcon },
];

type AccountNavProps = {
  current: AccountTab;
};

export function AccountNav({ current }: AccountNavProps) {
  return (
    <nav
      aria-label="เมนูบัญชีของฉัน"
      className="mb-6 flex items-center gap-1 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-1"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === current;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition ${
              isActive
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--ink-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

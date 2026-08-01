"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LogOut, Menu, ShieldCheck } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-sidebar";
import { RoleSwitcher } from "@/components/admin/role-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStaffSession } from "@/lib/admin/staff-session";
import { staffRoleInfo } from "@/lib/admin/types";

function initials(name: string): string {
  return name.replace(/^(ผศ|รศ|ศ)\.?(ดร\.?)?\s*/u, "").trim().charAt(0) || "?";
}

function SidebarBrand() {
  return (
    <Link
      href="/admin"
      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
        <ShieldCheck className="size-4" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-[var(--sidebar-foreground)]">
          Credit Bank
        </span>
        <span className="block truncate text-[11px] text-[color:color-mix(in_oklch,var(--sidebar-foreground)_58%,transparent)]">
          ระบบหลังบ้าน
        </span>
      </span>
    </Link>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { staff, role, isSignedIn, signOut } = useStaffSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // The prototype has no server-side gate; this is the client-side equivalent
  // so a signed-out reviewer lands on the login screen instead of an empty shell.
  useEffect(() => {
    if (!isSignedIn) router.replace("/admin/login");
  }, [isSignedIn, router]);

  if (!staff || !role) return null;

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-e border-[var(--sidebar-border)] bg-[var(--sidebar)] lg:flex">
        <div className="px-3 pt-4">
          <SidebarBrand />
        </div>
        <AdminNav role={role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--border)] bg-[color:color-mix(in_oklch,var(--background)_92%,transparent)] px-4 backdrop-blur">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="เปิดเมนู">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto bg-[var(--sidebar)] p-0">
              <SheetTitle className="sr-only">เมนูระบบหลังบ้าน</SheetTitle>
              <div className="px-3 pt-4">
                <SidebarBrand />
              </div>
              <AdminNav role={role} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ms-auto flex items-center gap-2">
            <RoleSwitcher />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-1.5">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-[var(--surface-strong)] text-xs font-semibold">
                      {initials(staff.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">{staff.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="space-y-0.5 font-normal">
                  <span className="block text-sm font-medium">{staff.name}</span>
                  <span className="block text-xs text-[var(--ink-muted)]">{staff.email}</span>
                  <span className="block pt-1 text-xs text-[var(--ink-muted)]">
                    {staffRoleInfo[staff.role].label} · {staff.department}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut}>
                  <LogOut className="size-4" aria-hidden />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="admin-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

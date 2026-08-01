"use client";

import { Check, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaffSession } from "@/lib/admin/staff-session";
import { staffRoleInfo, type StaffRole } from "@/lib/admin/types";

const ROLES: StaffRole[] = ["super-admin", "officer", "teacher"];

/**
 * Prototype affordance, labelled as one.
 *
 * Reviewers need to see that an อาจารย์ genuinely cannot reach the finance
 * menu. Making them sign out and back in three times to check would bury the
 * single most important thing about the permission model.
 */
export function RoleSwitcher() {
  const { role, switchRole } = useStaffSession();
  if (!role) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="size-4" aria-hidden />
          <span className="hidden sm:inline">ดูในมุมมอง</span>
          <span className="font-semibold">{staffRoleInfo[role].shortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="font-normal text-[var(--ink-muted)]">
          สลับมุมมองเพื่อดูสิทธิ์ของแต่ละบทบาท
          <span className="mt-1 block text-[11px]">
            เครื่องมือสำหรับต้นแบบเท่านั้น ระบบจริงจะกำหนดจากบัญชีที่เข้าสู่ระบบ
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((r) => (
          <DropdownMenuItem
            key={r}
            onSelect={() => switchRole(r)}
            className="flex items-start gap-2.5 py-2"
          >
            <Check
              className={r === role ? "mt-0.5 size-4 shrink-0" : "mt-0.5 size-4 shrink-0 opacity-0"}
              aria-hidden
            />
            <span className="min-w-0 space-y-0.5">
              <span className="block text-sm font-medium">{staffRoleInfo[r].label}</span>
              <span className="block text-xs leading-5 text-[var(--ink-muted)]">
                {staffRoleInfo[r].description}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

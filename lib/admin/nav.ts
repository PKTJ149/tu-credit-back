/**
 * Back office navigation — the single source of truth for the sidebar.
 *
 * Role visibility lives here, not in the sidebar component, so a screen can
 * ask "may this role open this route?" without duplicating the rule. Items a
 * role cannot use are hidden outright rather than shown disabled: a menu that
 * lists things you can never click is noise, not information.
 */

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  FileBadge,
  FileClock,
  GraduationCap,
  LayoutDashboard,
  Landmark,
  Layers,
  ListChecks,
  Receipt,
  RefreshCcw,
  Repeat2,
  Scale,
  Undo2,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

import type { StaffRole } from "./types";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: StaffRole[];
  /** Routes not built yet stay visible but are marked, so the shape of the
   *  system is legible in the prototype without pretending to be finished. */
  upcoming?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

const ALL: StaffRole[] = ["super-admin", "officer", "teacher"];
const STAFF: StaffRole[] = ["super-admin", "officer"];
const ADMIN_ONLY: StaffRole[] = ["super-admin"];
const TEACHING: StaffRole[] = ["super-admin", "teacher"];

export const navGroups: NavGroup[] = [
  {
    label: "ภาพรวม",
    items: [{ label: "หน้าหลัก", href: "/admin", icon: LayoutDashboard, roles: ALL }],
  },
  {
    label: "การเงิน",
    items: [
      { label: "รออนุมัติการชำระเงิน", href: "/admin/payments", icon: Wallet, roles: STAFF },
      { label: "รายการชำระเงินทั้งหมด", href: "/admin/payments/all", icon: Receipt, roles: STAFF },
      { label: "การคืนเงิน", href: "/admin/payments/refunds", icon: Undo2, roles: STAFF },
      { label: "ตั้งค่าบัญชีธนาคาร", href: "/admin/payments/bank-accounts", icon: Landmark, roles: ADMIN_ONLY },
    ],
  },
  {
    label: "การลงทะเบียน",
    items: [
      { label: "รายการลงทะเบียน", href: "/admin/registrations", icon: ClipboardList, roles: STAFF },
      { label: "รายชื่อผู้เรียน", href: "/admin/students", icon: Users, roles: STAFF },
      { label: "รายชื่อรอที่นั่ง", href: "/admin/waitlist", icon: ListChecks, roles: STAFF },
    ],
  },
  {
    label: "เทียบโอนหน่วยกิต",
    items: [
      { label: "คำขอรอตรวจสอบ", href: "/admin/transfers", icon: Repeat2, roles: STAFF },
      { label: "ประวัติคำขอ", href: "/admin/transfers/history", icon: FileClock, roles: STAFF },
      { label: "สถาบันคู่ความร่วมมือ", href: "/admin/transfers/institutions", icon: Building2, roles: STAFF },
      { label: "ตารางเทียบหน่วยกิต", href: "/admin/transfers/mapping", icon: Scale, roles: ADMIN_ONLY },
    ],
  },
  {
    label: "วิชาการ",
    items: [
      { label: "หลักสูตร", href: "/admin/programs", icon: GraduationCap, roles: ALL },
      { label: "รายวิชา", href: "/admin/subjects", icon: BookOpen, roles: ALL },
      { label: "อาจารย์", href: "/admin/teachers", icon: UserCog, roles: STAFF },
      { label: "ตารางเรียน", href: "/admin/schedule", icon: CalendarDays, roles: ALL },
      { label: "ที่นั่งและความจุ", href: "/admin/capacity", icon: Layers, roles: STAFF },
      { label: "ภาคการศึกษา", href: "/admin/terms", icon: RefreshCcw, roles: ADMIN_ONLY },
    ],
  },
  {
    label: "ผลการเรียน",
    items: [
      { label: "บันทึกผลการเรียน", href: "/admin/grades", icon: FileBadge, roles: TEACHING, upcoming: true },
    ],
  },
];

export function navGroupsForRole(role: StaffRole): NavGroup[] {
  return navGroups
    .map((group) => ({ ...group, items: group.items.filter((i) => i.roles.includes(role)) }))
    .filter((group) => group.items.length > 0);
}

export function canAccess(role: StaffRole, href: string): boolean {
  const item = navGroups.flatMap((g) => g.items).find((i) => i.href === href);
  return item ? item.roles.includes(role) : false;
}

/**
 * Longest-prefix match, so `/admin/payments/pay1` highlights the payments
 * queue while `/admin/payments/all` still wins over `/admin/payments`.
 */
export function activeHref(pathname: string): string | undefined {
  const all = navGroups.flatMap((g) => g.items).map((i) => i.href);
  const matches = all.filter((href) => pathname === href || pathname.startsWith(`${href}/`));
  return matches.sort((a, b) => b.length - a.length)[0];
}

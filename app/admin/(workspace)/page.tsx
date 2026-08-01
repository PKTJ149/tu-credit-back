"use client";

import { useStaffSession } from "@/lib/admin/staff-session";
import { OfficerDashboard } from "./_dashboard/officer-dashboard";
import { SuperAdminDashboard } from "./_dashboard/super-admin-dashboard";
import { TeacherDashboard } from "./_dashboard/teacher-dashboard";

/**
 * One route, three dashboards. Which one renders is decided entirely by
 * `useStaffSession().role` — a super admin runs the institution, an officer
 * works a queue, a teacher sees only their own subjects. Every number each
 * dashboard shows is derived from the phase 1-3 mock world through
 * `lib/admin/mock-dashboard.ts`; nothing here invents a fact a screen this
 * summarises does not already have.
 */
export default function AdminHomePage() {
  const { staff, role } = useStaffSession();
  if (!staff || !role) return null;

  if (role === "super-admin") return <SuperAdminDashboard staff={staff} />;
  if (role === "officer") return <OfficerDashboard staff={staff} />;
  return <TeacherDashboard staff={staff} />;
}

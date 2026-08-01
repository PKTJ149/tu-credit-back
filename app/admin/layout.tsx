import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StaffSessionProvider } from "@/lib/admin/staff-session";

export const metadata: Metadata = {
  title: "ระบบหลังบ้าน | Credit Bank มหาวิทยาลัยธรรมศาสตร์",
  description: "ระบบจัดการสำหรับเจ้าหน้าที่ Credit Bank มหาวิทยาลัยธรรมศาสตร์",
  robots: { index: false, follow: false },
};

/**
 * Staff identity is mounted here and nowhere else. The student providers in
 * the root layout stay above this tree but are never read by admin screens —
 * a staff member is not a learner with extra buttons.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <StaffSessionProvider>{children}</StaffSessionProvider>;
}

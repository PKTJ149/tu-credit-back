import type { ReactNode } from "react";
import { MemberPageShell } from "@/components/member-page-shell";
import { ProfileSidebar, ProfileMobileTabs } from "@/components/profile-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <MemberPageShell title="โปรไฟล์ของฉัน" fullBleed>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Breadcrumb />
        <h1 className="mb-6 mt-2 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          โปรไฟล์ของฉัน
        </h1>
        <div className="flex gap-8">
          <ProfileSidebar />
          <div className="min-w-0 flex-1">
            <ProfileMobileTabs />
            {children}
          </div>
        </div>
      </div>
    </MemberPageShell>
  );
}

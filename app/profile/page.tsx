import Link from "next/link";
import { LogOut } from "lucide-react";
import { MemberPageShell } from "@/components/member-page-shell";

export default function ProfilePage() {
  return (
    <MemberPageShell
      title="โปรไฟล์ของฉัน"
      description="จัดการสถานะการเข้าใช้งานบัญชีของคุณ"
      currentNav="account"
    >
      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            ออกจากระบบ
          </h2>
          <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
            เมื่อออกจากระบบ คุณจะกลับไปยังหน้าเข้าสู่ระบบของ Credit Bank
          </p>
        </div>

        <Link href="/login" className="ui-button-primary mt-5 w-full sm:w-auto sm:min-w-44">
          <LogOut aria-hidden="true" className="h-4 w-4" />
          ออกจากระบบ
        </Link>
      </section>
    </MemberPageShell>
  );
}

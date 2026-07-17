import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function ResetSentPage() {
  return (
    <AuthPageShell
      badge="ส่งอีเมลแล้ว"
      title="ตรวจสอบอีเมลของคุณ"
      description="ระบบส่งคำแนะนำสำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณแล้ว"
      panelBadge="ยืนยันการกู้คืนบัญชี"
      panelTitle="ส่งคำแนะนำแล้ว"
      panelDescription="ถ้าไม่ได้รับอีเมลในอีกสักครู่ ให้ตรวจสอบโฟลเดอร์สแปมหรือขอส่งใหม่"
      currentStep="sign-in"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                ตรวจสอบกล่องข้อความ
              </h3>
              <p className="text-sm leading-7 text-[var(--ink-muted)]">
                เปิดอีเมลจาก Credit Bank แล้วกดลิงก์เพื่อตั้งรหัสผ่านใหม่
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="ui-button-primary w-full"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </AuthPageShell>
  );
}

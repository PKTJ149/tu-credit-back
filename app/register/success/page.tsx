import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function RegisterSuccessPage() {
  return (
    <AuthPageShell
      badge="สร้างบัญชีแล้ว"
      title="สร้างบัญชีเรียบร้อยแล้ว"
      description="คุณพร้อมไปขั้นตอนถัดไปแล้ว ระบบจะแนะนำสิ่งที่ต้องทำก่อนเริ่มใช้งาน Credit Bank"
      panelBadge="ลงทะเบียนสำเร็จ"
      panelTitle="สร้างบัญชีแล้ว"
      panelDescription="ระบบบันทึกข้อมูลบัญชีเบื้องต้นของคุณเรียบร้อยแล้ว"
      currentStep="register"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                สร้างบัญชีเรียบร้อยแล้ว
              </h3>
              <p className="text-sm leading-7 text-[var(--ink-muted)]">
                ระบบตั้งค่าบัญชีของคุณแล้ว ขั้นตอนถัดไปคือยืนยันบัญชีก่อนเริ่มใช้งานส่วนที่ต้องยืนยันตัวตน
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-4 text-sm leading-6 text-[var(--ink-muted)]">
          ไปต่อเพื่อยืนยันบัญชี และเปิดใช้งานขั้นตอนถัดไปของผู้เรียน
        </div>

        <Link
          href="/verification-pending"
          className="ui-button-primary w-full"
        >
          ดำเนินการต่อ
        </Link>
      </div>
    </AuthPageShell>
  );
}

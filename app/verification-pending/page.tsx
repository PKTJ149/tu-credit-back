import Link from "next/link";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function VerificationPendingPage() {
  return (
    <AuthPageShell
      badge="ต้องยืนยันบัญชี"
      title="ยืนยันบัญชีของคุณ"
      description="ตรวจสอบอีเมลและกดลิงก์ยืนยันบัญชีเพื่อใช้งาน Credit Bank มหาวิทยาลัยธรรมศาสตร์ต่อ"
      panelBadge="ขั้นตอนยืนยันบัญชี"
      panelTitle="ตรวจสอบอีเมลของคุณ"
      panelDescription="ถ้าไม่พบอีเมล ให้ตรวจสอบโฟลเดอร์สแปมหรือขอส่งอีเมลใหม่"
      currentStep="verify"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)] p-5 text-sm leading-7 text-[var(--ink-muted)]">
          การยืนยันบัญชีช่วยปกป้องโปรไฟล์ผู้เรียน และทำให้การลงทะเบียน
          การชำระเงิน และข้อมูลส่วนตัวเชื่อมกับบัญชีที่ถูกต้อง
        </div>

        <button
          type="button"
          className="ui-button-secondary w-full"
        >
          ส่งอีเมลยืนยันอีกครั้ง
        </button>

        <Link
          href="/profile-completion"
          className="ui-button-primary w-full"
        >
          ดำเนินการต่อหลังยืนยันบัญชี
        </Link>

        <Link
          href="/"
          className="inline-flex text-sm font-medium text-[var(--primary)] transition hover:text-[color:color-mix(in_oklch,var(--primary)_84%,black)]"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </AuthPageShell>
  );
}

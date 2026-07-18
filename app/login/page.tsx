import { AuthPageShell } from "@/components/auth-page-shell";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthPageShell
      badge="เข้าสู่ระบบผู้เรียน"
      title="เข้าสู่ระบบ Credit Bank"
      description="เข้าสู่บัญชีผู้เรียนเพื่อจัดการการลงทะเบียน การชำระเงิน และติดตามความก้าวหน้าการเรียนรู้ของคุณ"
      panelBadge="การเข้าใช้งานที่ปลอดภัย"
      panelTitle="เข้าสู่ระบบ"
      panelDescription="ใช้บัญชีผู้เรียนของคุณเพื่อดำเนินการต่อในส่วนที่ต้องยืนยันตัวตน"
      currentStep="sign-in"
    >
      <LoginForm />
    </AuthPageShell>
  );
}

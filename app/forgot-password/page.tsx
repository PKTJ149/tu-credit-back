import { AuthPageShell } from "@/components/auth-page-shell";
import { PasswordResetRequestForm } from "@/components/password-reset-request-form";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      badge="กู้คืนบัญชี"
      title="ตั้งรหัสผ่านใหม่"
      description="กรอกอีเมลที่ผูกกับบัญชี แล้วระบบจะส่งคำแนะนำสำหรับตั้งรหัสผ่านใหม่ให้คุณ"
      panelBadge="ช่วยเหลือเรื่องรหัสผ่าน"
      panelTitle="ตั้งรหัสผ่านใหม่"
      panelDescription="ใช้อีเมลบัญชีผู้เรียนที่ถูกต้องเพื่อขอตั้งรหัสผ่านใหม่อย่างปลอดภัย"
      currentStep="sign-in"
    >
      <PasswordResetRequestForm />
    </AuthPageShell>
  );
}

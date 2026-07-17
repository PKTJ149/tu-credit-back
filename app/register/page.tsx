import { AuthPageShell } from "@/components/auth-page-shell";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <AuthPageShell
      badge="เริ่มต้นสำหรับผู้เรียนใหม่"
      title="สร้างบัญชี Credit Bank"
      description="ตั้งค่าบัญชีเพื่อเริ่มเรียน ติดตามความก้าวหน้า และจัดการเส้นทางการเรียนของคุณได้ชัดเจนขึ้น"
      panelBadge="สร้างบัญชี"
      panelTitle="สร้างบัญชีของคุณ"
      panelDescription="กรอกข้อมูลขั้นต่ำที่จำเป็นก่อนใช้งานการลงทะเบียน การชำระเงิน และการตั้งค่าโปรไฟล์"
      currentStep="register"
    >
      <RegisterForm />
    </AuthPageShell>
  );
}

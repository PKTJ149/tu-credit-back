import { AuthPageShell } from "@/components/auth-page-shell";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <AuthPageShell
      badge="เริ่มต้นสำหรับผู้เรียนใหม่"
      title="สร้างบัญชี Credit Bank"
      description="เปิดบัญชีเพื่อลงทะเบียนเรียน ติดตามความก้าวหน้า และจัดการเส้นทางการเรียนทั้งหมดในที่เดียว รองรับทั้งนักศึกษา มธ. และบุคคลทั่วไป"
      panelBadge="สร้างบัญชี"
      panelTitle="กรอกข้อมูลผู้สมัคร"
      panelDescription="เลือกประเภทบัญชีให้ตรงกับสถานะของคุณ แล้วกรอกข้อมูลที่จำเป็น ระบบจะส่งอีเมลยืนยันให้หลังจากนั้น"
      currentStep="register"
      size="wide"
    >
      <RegisterForm />
    </AuthPageShell>
  );
}

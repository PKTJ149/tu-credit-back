import { AuthPageShell } from "@/components/auth-page-shell";
import { ProfileCompletionForm } from "@/components/profile-completion-form";

export default function ProfileCompletionPage() {
  return (
    <AuthPageShell
      badge="ข้อมูลเริ่มต้นของผู้เรียน"
      title="กรอกโปรไฟล์ให้ครบ"
      description="ระบบต้องใช้ข้อมูลบางส่วนก่อนที่คุณจะลงทะเบียนเรียนและจัดการการชำระเงินใน Credit Bank มหาวิทยาลัยธรรมศาสตร์ได้"
      panelBadge="จำเป็นก่อนใช้งานส่วนสำคัญ"
      panelTitle="ข้อมูลโปรไฟล์"
      panelDescription="กรอกข้อมูลผู้เรียนขั้นต่ำที่จำเป็นสำหรับการลงทะเบียน การชำระเงิน และคำขอที่ต้องยืนยันตัวตนในขั้นตอนถัดไป"
      currentStep="profile"
      size="wide"
    >
      <ProfileCompletionForm />
    </AuthPageShell>
  );
}

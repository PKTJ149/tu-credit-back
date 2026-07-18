import { MemberPageShell } from "@/components/member-page-shell";
import { AccountNav } from "@/components/account/account-nav";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export default function ChangePasswordPage() {
  return (
    <MemberPageShell
      title="เปลี่ยนรหัสผ่าน"
      description="ตั้งรหัสผ่านใหม่เพื่อรักษาความปลอดภัยของบัญชีของคุณ"
      currentNav="account"
    >
      <AccountNav current="password" />
      <ChangePasswordForm />
    </MemberPageShell>
  );
}

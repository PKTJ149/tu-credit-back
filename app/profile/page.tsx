import { MemberPageShell } from "@/components/member-page-shell";
import { AccountNav } from "@/components/account/account-nav";
import { ProfileForm } from "@/components/account/profile-form";

export default function ProfilePage() {
  return (
    <MemberPageShell
      title="โปรไฟล์ของฉัน"
      description="ดูและแก้ไขข้อมูลส่วนตัวและข้อมูลการศึกษาของคุณ"
      currentNav="account"
    >
      <AccountNav current="profile" />
      <ProfileForm />
    </MemberPageShell>
  );
}

import { MemberPageShell } from "@/components/member-page-shell";
import { AccountNav } from "@/components/account/account-nav";
import { SettingsForm } from "@/components/account/settings-form";

export default function SettingsPage() {
  return (
    <MemberPageShell
      title="ตั้งค่า"
      description="จัดการการแจ้งเตือนและความเป็นส่วนตัวของบัญชีของคุณ"
      currentNav="account"
    >
      <AccountNav current="settings" />
      <SettingsForm />
    </MemberPageShell>
  );
}

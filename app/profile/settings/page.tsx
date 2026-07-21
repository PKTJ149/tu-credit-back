import { SettingsForm } from "@/components/account/settings-form";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ตั้งค่า</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ปรับแต่งการแจ้งเตือนและการแสดงผลของระบบ
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}

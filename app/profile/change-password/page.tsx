import { ChangePasswordForm } from "@/components/account/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">เปลี่ยนรหัสผ่าน</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          อัพเดตรหัสผ่านของคุณเพื่อความปลอดภัยของบัญชี
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}

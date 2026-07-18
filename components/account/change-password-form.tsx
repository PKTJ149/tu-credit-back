"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: PasswordErrors = {};

    if (!currentPassword.trim()) {
      nextErrors.currentPassword = "กรุณากรอกรหัสผ่านปัจจุบัน";
    }
    if (newPassword.length < 8) {
      nextErrors.newPassword = "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร";
    }
    if (confirmPassword !== newPassword || !confirmPassword) {
      nextErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    setErrors(nextErrors);
    setIsSuccess(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSaving(false);
    setIsSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form
      className="min-w-0 max-w-xl space-y-5 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)]">เปลี่ยนรหัสผ่าน</h2>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ตั้งรหัสผ่านใหม่เพื่อความปลอดภัยของบัญชี
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm font-medium text-[var(--foreground)]">
          รหัสผ่านปัจจุบัน
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          aria-invalid={errors.currentPassword ? "true" : "false"}
          className="ui-input"
        />
        {errors.currentPassword ? <p className="ui-error-text">{errors.currentPassword}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium text-[var(--foreground)]">
          รหัสผ่านใหม่
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          aria-invalid={errors.newPassword ? "true" : "false"}
          className="ui-input"
        />
        {errors.newPassword ? (
          <p className="ui-error-text">{errors.newPassword}</p>
        ) : (
          <p className="ui-helper-text">อย่างน้อย 8 ตัวอักษร</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--foreground)]">
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          className="ui-input"
        />
        {errors.confirmPassword ? <p className="ui-error-text">{errors.confirmPassword}</p> : null}
      </div>

      {isSuccess ? (
        <div className="flex items-center gap-3 rounded-lg border border-[color:color-mix(in_oklch,var(--primary)_22%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_28%,white)] px-4 py-3 text-sm text-[var(--foreground)]">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
          <span>เปลี่ยนรหัสผ่านเรียบร้อยแล้ว</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="ui-button-primary w-full sm:w-auto sm:min-w-44"
      >
        {isSaving ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
      </button>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";

type FormErrors = {
  identifier?: string;
  password?: string;
  general?: string;
};

const IDENTIFIER_PLACEHOLDER = "name@example.com หรือเลขประจำตัว";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = useMemo(() => {
    return identifier.trim().length > 0 && password.trim().length > 0;
  }, [identifier, password]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!identifier.trim()) {
      nextErrors.identifier = "กรุณากรอกอีเมลหรือเลขประจำตัว";
    }

    if (!password.trim()) {
      nextErrors.password = "กรุณากรอกรหัสผ่าน";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSubmitting(false);
    setErrors({
      general:
        "ยังไม่สามารถเข้าสู่ระบบด้วยข้อมูลนี้ได้ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง",
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="text-sm font-medium text-[var(--foreground)]"
        >
          อีเมลหรือเลขประจำตัว
        </label>
        <input
          id="identifier"
          type="text"
          autoComplete="username"
          placeholder={IDENTIFIER_PLACEHOLDER}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          aria-invalid={errors.identifier ? "true" : "false"}
          aria-describedby={errors.identifier ? "identifier-error" : undefined}
          className="ui-input"
        />
        {errors.identifier ? (
          <p id="identifier-error" className="ui-error-text">
            {errors.identifier}
          </p>
        ) : (
          <p className="ui-helper-text">
            ใช้บัญชีเดียวกับที่ใช้ลงทะเบียนเรียนและตรวจสอบประวัติการชำระเงิน
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            รหัสผ่าน
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[var(--primary)] transition hover:text-[color:color-mix(in_oklch,var(--primary)_84%,black)]"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="กรอกรหัสผ่าน"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="ui-input"
        />
        {errors.password ? (
          <p id="password-error" className="ui-error-text">
            {errors.password}
          </p>
        ) : null}
      </div>

      <label className="flex min-h-11 items-center gap-3 text-sm text-[var(--ink-muted)]">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="h-4 w-4 rounded border-[color:var(--border)] text-[var(--primary)] focus:ring-[color:var(--ring)]"
        />
        จดจำอุปกรณ์นี้
      </label>

      {errors.general ? (
        <div
          role="alert"
          className="rounded-lg border border-[color:color-mix(in_oklch,var(--destructive)_22%,white)] bg-[color:color-mix(in_oklch,var(--destructive)_8%,white)] px-4 py-3 text-sm text-[color:color-mix(in_oklch,var(--destructive)_90%,black)]"
        >
          {errors.general}
        </div>
      ) : null}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="ui-button-primary w-full"
        >
          <LogIn aria-hidden="true" className="h-4 w-4" />
          {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <button
          type="button"
          className="ui-button-secondary w-full"
        >
          เข้าสู่ระบบด้วย Google
        </button>
      </div>

      <div className="flex flex-col gap-3 border-t border-[color:var(--border)] pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[var(--ink-muted)]">
          ยังไม่มีบัญชี Credit Bank?
        </p>
        <Link
          href="/register"
          className="font-medium text-[var(--primary)] transition hover:text-[color:color-mix(in_oklch,var(--primary)_84%,black)]"
        >
          สร้างบัญชี
        </Link>
      </div>

      <div className="rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_22%,white)] px-4 py-3 text-sm leading-6 text-[var(--ink-muted)]">
        {isComplete
          ? "บัญชีนี้ใช้สำหรับลงทะเบียนเรียน ชำระเงิน และติดตามความก้าวหน้าการเรียน"
          : "เข้าสู่บัญชีผู้เรียนเพื่อจัดการการลงทะเบียน การชำระเงิน และความก้าวหน้า"}
      </div>
    </form>
  );
}

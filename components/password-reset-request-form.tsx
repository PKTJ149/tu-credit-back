"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { useState } from "react";

export function PasswordResetRequestForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setError("กรุณากรอกอีเมลที่ถูกต้อง");
      return;
    }

    setError("");
    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    router.push("/reset-sent");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">
          อีเมล
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="name@example.com"
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? "true" : "false"}
          className="ui-input"
        />
        {error ? (
          <p className="ui-error-text">{error}</p>
        ) : (
          <p className="ui-helper-text">
            กรอกอีเมลที่ผูกกับบัญชี แล้วระบบจะส่งคำแนะนำสำหรับตั้งรหัสผ่านใหม่
          </p>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="ui-button-primary w-full"
        >
          <MailCheck aria-hidden="true" className="h-4 w-4" />
          {isSubmitting ? "กำลังส่ง..." : "ส่งคำแนะนำสำหรับตั้งรหัสผ่านใหม่"}
        </button>

        <Link
          href="/login"
          className="inline-flex text-sm font-medium text-[var(--primary)] transition hover:text-[color:color-mix(in_oklch,var(--primary)_84%,black)]"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </form>
  );
}

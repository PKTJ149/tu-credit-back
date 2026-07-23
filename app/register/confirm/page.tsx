"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth-page-shell";
import { useAuth } from "@/lib/auth/auth-context";
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react";

const RESEND_SECONDS = 90;

export default function RegisterConfirmPage() {
  return (
    <Suspense fallback={null}>
      <RegisterConfirmContent />
    </Suspense>
  );
}

function RegisterConfirmContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const email = params.get("email") ?? "อีเมลของคุณ";
  const userType = params.get("type") ?? "student";

  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const canResend = countdown === 0;

  function handleResend() {
    if (!canResend) return;
    setResendCount((n) => n + 1);
    setCountdown(RESEND_SECONDS);
  }

  return (
    <AuthPageShell
      badge="ขั้นตอนถัดไป"
      title="ยืนยันอีเมลของคุณ"
      description="ระบบส่งลิงก์ยืนยันไปแล้ว กรุณาตรวจสอบกล่องจดหมายและกดลิงก์เพื่อเปิดใช้งานบัญชี"
      panelBadge="ยืนยันอีเมล"
      panelTitle="ตรวจสอบกล่องจดหมาย"
      panelDescription="ลิงก์ยืนยันจะหมดอายุใน 24 ชั่วโมง หากไม่พบในกล่องหลัก ให้ตรวจสอบในโฟลเดอร์ Spam หรือ Junk"
      currentStep="verify"
      hideSteps
      size="wide"
      sidebarStats={[
        { label: "สถานะบัญชี", value: "รอการยืนยันอีเมล" },
        { label: "ลิงก์หมดอายุใน", value: "24 ชั่วโมง" },
        { label: "ช่องทางช่วยเหลือ", value: "บริการผู้เรียน มธ." },
      ]}
      sidebarPoints={[
        "ตรวจสอบโฟลเดอร์ Spam หรือ Junk หากไม่พบในกล่องหลัก",
        "อีเมลส่งจาก no-reply@creditbank.tu.ac.th ใช้เวลาไม่เกิน 5 นาที",
        "กดลิงก์ยืนยันได้ครั้งเดียว หากลิงก์หมดอายุให้ขอส่งใหม่",
      ]}
    >
      <div className="space-y-5">
        {/* Email display */}
        <div className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_14%,white)] px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Mail aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--ink-subtle)]">ส่งลิงก์ยืนยันไปที่</p>
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">{email}</p>
            {userType === "student" && (
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">อีเมลมหาวิทยาลัยธรรมศาสตร์</p>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] px-5 py-4">
          <p className="mb-4 text-sm font-semibold text-[var(--foreground)]">ขั้นตอนการยืนยัน</p>
          <ol className="space-y-3">
            {[
              "เปิดอีเมลจาก Credit Bank มหาวิทยาลัยธรรมศาสตร์",
              'กดปุ่ม "ยืนยันอีเมล" ในอีเมลที่ได้รับ',
              "ระบบจะพาคุณกลับมาสู่โปรไฟล์ของคุณโดยอัตโนมัติ",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--ink-muted)]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--primary)_18%,white)] text-[10px] font-bold text-[var(--primary)]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Prototype confirm button */}
        <div className="rounded-xl border-2 border-dashed border-[color:color-mix(in_oklch,var(--primary)_30%,var(--border))] bg-[color:color-mix(in_oklch,var(--primary)_4%,white)] px-5 py-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            จำลองการกดลิงก์ในอีเมล
          </p>
          <p className="mb-4 text-sm text-[var(--ink-muted)]">
            ในระบบจริง ปุ่มนี้จะอยู่ในอีเมลที่คุณได้รับ
          </p>
          <button
            type="button"
            onClick={() => { login(email); router.push("/profile"); }}
            className="ui-button-primary w-full"
          >
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            ยืนยันอีเมลและเข้าสู่ระบบ
          </button>
        </div>

        {/* Resend */}
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[color:var(--border)] px-4 py-3">
          <div className="text-sm text-[var(--ink-muted)]">
            {resendCount > 0 ? (
              <span className="text-[var(--ink-subtle)]">ส่งอีเมลใหม่แล้ว {resendCount} ครั้ง</span>
            ) : (
              "ไม่ได้รับอีเมล?"
            )}
          </div>
          <button
            type="button"
            disabled={!canResend}
            onClick={handleResend}
            className={`inline-flex items-center gap-2 text-sm font-medium transition ${
              canResend
                ? "text-[var(--primary)] hover:text-[color:color-mix(in_oklch,var(--primary)_80%,black)]"
                : "cursor-not-allowed text-[var(--ink-subtle)]"
            }`}
          >
            <RefreshCw aria-hidden="true" className={`h-4 w-4 ${!canResend ? "opacity-40" : ""}`} />
            {canResend ? "ส่งอีเมลอีกครั้ง" : `ส่งอีกครั้งใน ${timeDisplay}`}
          </button>
        </div>

        <p className="text-center text-xs text-[var(--ink-subtle)]">
          อีเมลผิดหรือต้องการเปลี่ยน?{" "}
          <a href="/register" className="font-medium text-[var(--primary)] underline-offset-2 hover:underline">
            กลับไปแก้ไข
          </a>
        </p>
      </div>
    </AuthPageShell>
  );
}

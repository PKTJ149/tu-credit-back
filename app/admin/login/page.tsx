"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Info, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staffUsers } from "@/lib/admin/mock-data";
import { useStaffSession } from "@/lib/admin/staff-session";
import { staffRoleInfo } from "@/lib/admin/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useStaffSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeAccounts = staffUsers.filter((s) => s.status === "active");

  function enter(staffId: string) {
    setSubmitting(true);
    signIn(staffId);
    router.push("/admin");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const match = activeAccounts.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
    if (!match) {
      setError("ไม่พบบัญชีเจ้าหน้าที่นี้ในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง");
      return;
    }
    setError(null);
    enter(match.id);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_460px]">
      {/* Identity panel.
          The learner site is white-on-white and calm by design. Staff arriving
          here must know in one glance they are somewhere else, so this one
          surface goes Committed: the institutional red carries the whole
          panel. No decorative blur, no glass — the colour does the work. */}
      <section className="hidden flex-col justify-between bg-[var(--primary)] p-12 text-[var(--primary-foreground)] lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-[var(--primary-foreground)]">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold">Credit Bank มหาวิทยาลัยธรรมศาสตร์</span>
            <span className="block text-xs text-[color:color-mix(in_oklch,var(--primary-foreground)_74%,transparent)]">
              ระบบหลังบ้านสำหรับเจ้าหน้าที่
            </span>
          </span>
        </div>

        <div className="max-w-md space-y-4">
          <h2 className="text-2xl leading-9 font-semibold text-balance">
            ตรวจสอบการชำระเงิน อนุมัติการเทียบโอน และดูแลข้อมูลหลักสูตรในที่เดียว
          </h2>
          <p className="text-sm leading-6 text-pretty text-[color:color-mix(in_oklch,var(--primary-foreground)_84%,transparent)]">
            สิทธิ์การเข้าถึงกำหนดตามบทบาทของบัญชี เจ้าหน้าที่แต่ละคนจะเห็นเฉพาะงานที่รับผิดชอบ
            และทุกการอนุมัติจะถูกบันทึกไว้ตรวจสอบย้อนหลังได้
          </p>
        </div>

        <p className="text-xs text-[color:color-mix(in_oklch,var(--primary-foreground)_74%,transparent)]">
          สำหรับเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น
        </p>
      </section>

      <section className="flex flex-col justify-center bg-[var(--background)] px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm space-y-7">
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold">เข้าสู่ระบบเจ้าหน้าที่</h1>
            <p className="text-sm leading-6 text-[var(--ink-muted)]">
              ใช้อีเมลของมหาวิทยาลัยที่ได้รับสิทธิ์ใช้งานระบบหลังบ้าน
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="staff-email">อีเมลเจ้าหน้าที่</Label>
              <Input
                id="staff-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@tu.ac.th"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "staff-email-error" : undefined}
              />
              {error ? (
                <p id="staff-email-error" role="alert" className="text-sm text-[var(--destructive)]">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-password">รหัสผ่าน</Label>
              <Input
                id="staff-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </Button>
          </form>

          {/* Honest about what this is. A demo login that pretends to
              authenticate is worse than one that says it does not. */}
          <div className="space-y-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="flex items-start gap-2 text-xs leading-5 text-[var(--ink-muted)]">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              ต้นแบบนี้ยังไม่ตรวจสอบรหัสผ่านจริง เลือกบัญชีด้านล่างเพื่อเข้าใช้งานในบทบาทนั้นได้ทันที
            </p>
            <ul className="space-y-1">
              {activeAccounts.map((account) => (
                <li key={account.id}>
                  <button
                    type="button"
                    onClick={() => enter(account.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-start transition-colors hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{account.name}</span>
                      <span className="block truncate text-xs text-[var(--ink-muted)]">{account.email}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[var(--background)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-muted)] ring-1 ring-[var(--border)] ring-inset">
                      {staffRoleInfo[account.role].shortLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" aria-hidden />
            กลับไปเว็บไซต์สำหรับผู้เรียน
          </Link>
        </div>
      </section>
    </div>
  );
}

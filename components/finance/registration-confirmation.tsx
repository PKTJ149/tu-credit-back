"use client";

import Link from "next/link";
import { CheckCircle2, CircleAlert, ArrowRight } from "lucide-react";
import { formatTHB } from "@/lib/finance/payment-state";
import { useSessionData } from "@/lib/session/session-data";

export function RegistrationConfirmation() {
  const { data } = useSessionData();
  // The most recently registered item is the one we just confirmed.
  const latest = data.registrations[0];

  // Safety net: someone opened this page without registering anything.
  if (!latest) {
    return (
      <div className="mx-auto max-w-2xl">
        <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6 text-center sm:p-8">
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            ยังไม่มีรายการลงทะเบียนล่าสุด
          </p>
          <Link href="/member/programs" className="ui-button-primary mt-6">
            เลือกหลักสูตรเพื่อลงทะเบียน
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    );
  }

  const paymentRequired = latest.amount > 0;
  const itemLabel = `${latest.itemType === "program" ? "หลักสูตร" : "รายวิชา"}: ${latest.itemName} (${latest.term})`;

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_45%,white)] text-[var(--secondary-foreground)]">
            <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold leading-9 text-[var(--foreground)]">
              ลงทะเบียนสำเร็จ
            </h1>
            <p className="text-sm leading-7 text-[var(--ink-muted)]">
              ระบบบันทึกการลงทะเบียนของคุณเรียบร้อยแล้ว
              ตรวจสอบขั้นตอนถัดไปด้านล่างเพื่อดำเนินการต่อ
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {itemLabel}
          </p>
          {paymentRequired ? (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              ยอดที่ต้องชำระ
              <span className="ml-2 text-base font-semibold text-[var(--foreground)]">
                {formatTHB(latest.amount)}
              </span>
            </p>
          ) : null}
        </div>

        <div
          className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${
            paymentRequired
              ? "border-[color:color-mix(in_oklch,var(--primary)_28%,white)] bg-[color:color-mix(in_oklch,var(--primary)_6%,white)]"
              : "border-[color:color-mix(in_oklch,var(--secondary)_45%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)]"
          }`}
        >
          {paymentRequired ? (
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
            />
          ) : (
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
            />
          )}
          <p className="text-sm leading-7 text-[var(--foreground)]">
            {paymentRequired
              ? "ต้องชำระเงินก่อนการลงทะเบียนนี้จะดำเนินการต่อได้"
              : "ไม่มีค่าใช้จ่ายสำหรับการลงทะเบียนนี้ คุณสามารถใช้งานส่วนที่เกี่ยวข้องได้ทันที"}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {paymentRequired ? (
            <>
              <Link href="/finance" className="ui-button-primary w-full sm:w-auto sm:flex-1">
                ไปที่หน้าการเงิน
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/registrations" className="ui-button-secondary w-full sm:w-auto sm:flex-1">
                ดูรายการลงทะเบียนของฉัน
              </Link>
            </>
          ) : (
            <>
              <Link href="/registrations" className="ui-button-primary w-full sm:w-auto sm:flex-1">
                ดูรายการลงทะเบียนของฉัน
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/finance" className="ui-button-secondary w-full sm:w-auto sm:flex-1">
                ไปที่หน้าการเงิน
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

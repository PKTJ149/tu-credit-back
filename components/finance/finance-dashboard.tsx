"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ReceiptText,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { StatusBadge } from "@/components/finance/status-badge";
import { SectionCard } from "@/components/finance/section-card";
import { formatTHB, type PaymentState } from "@/lib/finance/payment-state";
import { CURRENT_TERM, useSessionData } from "@/lib/session/session-data";
import { programs } from "@/lib/data/programs";
import { getSubjectsByIds, subjects } from "@/lib/data/subjects";

function getActionForState(state: PaymentState) {
  if (state === "payment-required") {
    return { label: "ชำระเงิน", href: "/profile/finance/instructions" };
  }
  if (
    state === "payment-confirmed" ||
    state === "pending-verification" ||
    state === "notice-submitted"
  ) {
    return { label: "ส่งหลักฐานการชำระเงิน", href: "/profile/finance/submit-proof" };
  }
  return null;
}

function paymentStatusInfo(state: PaymentState) {
  if (state === "payment-required") {
    return {
      label: "รอชำระเงิน",
      className: "bg-red-50 text-red-700",
    };
  }
  if (state === "payment-cancelled") {
    return {
      label: "ยกเลิก",
      className: "bg-[color:color-mix(in_oklch,var(--muted)_70%,white)] text-[var(--ink-subtle)]",
    };
  }
  if (state === "payment-confirmed" || state === "pending-verification" || state === "notice-submitted") {
    return {
      label: "ชำระแล้ว",
      className: "bg-green-50 text-green-700",
    };
  }
  return undefined;
}

export function FinanceDashboard() {
  const { data, cancelRegistration } = useSessionData();
  const [expandedRegistrationId, setExpandedRegistrationId] = useState<string | null>(null);

  const registrationItems = data.payables.map((item) => ({
    payable: item,
    registration: data.registrations.find((registration) => registration.id === item.registrationId),
  }));

  // Confirmed payments become the transaction history preview.
  const historyPreview = data.payables
    .filter((item) => item.state === "payment-confirmed")
    .map((item) => ({
      id: item.id,
      name: item.name,
      date: CURRENT_TERM,
      amount: item.amount,
      state: item.state,
    }));

  const outstandingBalance = data.payables.reduce(
    (total, item) =>
      item.state === "payment-required" ? total + item.amount : total,
    0,
  );

  const hasRegistrations = registrationItems.length > 0;
  const hasPaymentRequired = data.payables.some(
    (item) => item.state === "payment-required",
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <SectionCard>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm font-medium text-[var(--ink-muted)]">
              ยอดค้างชำระทั้งหมด
            </p>
            <p className="font-mono text-2xl font-semibold text-[var(--foreground)]">
              {formatTHB(outstandingBalance)}
            </p>
          </div>
        </SectionCard>

        {!hasPaymentRequired ? (
          <div className="flex items-start gap-4 rounded-xl border border-[color:color-mix(in_oklch,var(--secondary)_30%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_10%,white)] p-5">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--secondary-foreground)]"
            />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                ไม่มียอดค้างชำระในขณะนี้
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                เมื่อคุณลงทะเบียนรายวิชา ยอดชำระจะแสดงที่นี่ พร้อมขั้นตอนการดำเนินการ
              </p>
            </div>
          </div>
        ) : null}

        <SectionCard title="รายการที่ลงทะเบียน">
          {hasRegistrations ? (
            <div className="space-y-3">
              {registrationItems.map(({ payable, registration }) => {
                const action = getActionForState(payable.state);
                const isProgram = registration?.itemType === "program";
                const program = isProgram
                  ? programs.find((item) => item.slug === registration?.slug)
                  : undefined;
                const selectedSubjects = program
                  ? getSubjectsByIds(registration?.selectedSubjectIds ?? program.subjectIds)
                  : subjects.filter((subject) => subject.slug === registration?.slug);
                const expandable = isProgram && selectedSubjects.length > 0;
                const expanded = expandedRegistrationId === payable.registrationId;
                const statusOverride = paymentStatusInfo(payable.state);

                return (
                  <article
                    key={payable.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          expandable &&
                          setExpandedRegistrationId(expanded ? null : payable.registrationId)
                        }
                        disabled={!expandable}
                        className="min-w-0 text-left disabled:cursor-default"
                      >
                        <div className="flex items-start gap-2">
                          {expandable ? (
                            <ChevronDown
                              aria-hidden="true"
                              className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--ink-subtle)] transition ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          ) : null}
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold text-[var(--foreground)]">
                              {payable.name}
                            </p>
                            <p className="mt-1 text-xs text-[var(--ink-muted)]">
                              {isProgram ? "หลักสูตร" : "รายวิชา"} · {registration?.term ?? CURRENT_TERM}
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                        <span className="font-mono text-base font-semibold text-[var(--foreground)]">
                          {formatTHB(payable.amount)}
                        </span>
                        {statusOverride ? (
                          <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${statusOverride.className}`}>
                            {statusOverride.label}
                          </span>
                        ) : (
                          <StatusBadge state={payable.state} />
                        )}
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 rounded-lg border border-[color:var(--border)] bg-[var(--surface)]">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 border-b border-[color:var(--border)] px-3 py-2 text-xs font-semibold text-[var(--ink-muted)]">
                          <span>รายวิชาที่เลือก</span>
                          <span className="text-right">หน่วยกิต</span>
                          <span className="text-right">ราคา</span>
                        </div>
                        <div className="divide-y divide-[color:var(--border)]">
                          {selectedSubjects.map((subject) => (
                            <div
                              key={subject.id}
                              className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-3 py-2 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="line-clamp-1 font-medium text-[var(--foreground)]">
                                  {subject.name}
                                </p>
                                <p className="mt-0.5 text-[var(--ink-muted)]">{subject.code}</p>
                              </div>
                              <span className="whitespace-nowrap text-right text-[var(--foreground)]">
                                {subject.credits} หน่วยกิต
                              </span>
                              <span className="whitespace-nowrap rounded-full bg-[var(--background)] px-2 py-1 text-right font-semibold text-[var(--primary)]">
                                {formatTHB(subject.price ?? 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-col gap-2 border-t border-[color:var(--border)] pt-4 sm:flex-row sm:justify-end">
                      {payable.state !== "payment-cancelled" ? (
                        <button
                          type="button"
                          onClick={() => cancelRegistration(payable.registrationId)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] px-3 text-xs font-medium text-[var(--ink-muted)] transition hover:border-red-200 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                        >
                          <X aria-hidden="true" className="h-3.5 w-3.5" />
                          ยกเลิกรายการ
                        </button>
                      ) : null}
                      {action ? (
                        <Link
                          href={action.href}
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-xs font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                        >
                          {action.label}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-10 text-center">
              <Wallet aria-hidden="true" className="h-7 w-7 text-[var(--ink-subtle)]" />
              <p className="text-sm leading-7 text-[var(--ink-muted)]">
                ยังไม่มีรายการที่ลงทะเบียน รายการจะปรากฏที่นี่หลังจากลงทะเบียนหลักสูตรหรือรายวิชา
              </p>
            </div>
          )}
        </SectionCard>

      </div>

      <div className="space-y-6">
        {hasRegistrations ? (
          <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">การดำเนินการ</h2>
            <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/profile/finance/instructions"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
            >
              <ReceiptText aria-hidden="true" className="h-4 w-4" />
              ดูวิธีการชำระเงิน
            </Link>
            <Link
              href="/profile/finance/submit-proof"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[color:var(--ring)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
            >
              <Upload aria-hidden="true" className="h-4 w-4" />
              ส่งหลักฐานการชำระเงิน
            </Link>
            </div>
          </section>
        ) : null}
        <SectionCard title="ประวัติการทำรายการล่าสุด">
          {historyPreview.length > 0 ? (
            <>
              <div>
                {historyPreview.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-2 border-b border-[color:var(--border)] py-3 last:border-b-0 last:pb-0"
                  >
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">
                      {entry.name}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--ink-subtle)]">{entry.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[var(--foreground)]">
                          {formatTHB(entry.amount)}
                        </span>
                        <StatusBadge state={entry.state} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/profile/finance/documents"
                className="mt-4 inline-flex text-sm font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
              >
                ดูเอกสารทั้งหมด
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-4 py-8 text-center">
              <p className="text-sm leading-6 text-[var(--ink-muted)]">
                ยังไม่มีประวัติการทำรายการ
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

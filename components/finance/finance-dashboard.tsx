"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ReceiptText,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { SectionCard } from "@/components/finance/section-card";
import { formatTHB, type PaymentState } from "@/lib/finance/payment-state";
import { CURRENT_TERM, useSessionData } from "@/lib/session/session-data";
import { programs } from "@/lib/data/programs";
import { getSubjectsByIds, subjects } from "@/lib/data/subjects";

type PaymentAction = {
  label: string;
  href: string;
  icon: "receipt" | "upload";
  tone: "primary" | "neutral";
};

function getActionForState(state: PaymentState): PaymentAction | null {
  if (state === "payment-required") {
    return {
      label: "ชำระเงิน",
      href: "/profile/finance/instructions",
      icon: "receipt",
      tone: "primary",
    };
  }

  if (
    state === "payment-confirmed" ||
    state === "pending-verification" ||
    state === "notice-submitted"
  ) {
    return {
      label: "ส่งหลักฐานการชำระเงิน",
      href: "/profile/finance/submit-proof",
      icon: "upload",
      tone: "neutral",
    };
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
      className:
        "bg-[color:color-mix(in_oklch,var(--muted)_70%,white)] text-[var(--ink-subtle)]",
    };
  }

  if (
    state === "payment-confirmed" ||
    state === "pending-verification" ||
    state === "notice-submitted"
  ) {
    return {
      label: "ชำระแล้ว",
      className: "bg-green-50 text-green-700",
    };
  }

  return {
    label: "กำลังดำเนินการ",
    className:
      "bg-[color:color-mix(in_oklch,var(--accent)_16%,white)] text-[var(--foreground)]",
  };
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-max max-w-52 rounded-md bg-[var(--foreground)] px-2 py-1 text-xs font-medium text-[var(--background)] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
      {label}
    </span>
  );
}

function IconButton({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: ReactNode;
  className: string;
  onClick: () => void;
}) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={className}
      >
        {children}
      </button>
      <Tooltip label={label} />
    </span>
  );
}

function IconLink({
  action,
  children,
}: {
  action: PaymentAction;
  children: ReactNode;
}) {
  const className =
    action.tone === "primary"
      ? "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
      : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[var(--background)] text-[var(--foreground)] transition hover:border-[color:var(--ring)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]";

  return (
    <span className="group relative inline-flex">
      <Link
        href={action.href}
        aria-label={action.label}
        title={action.label}
        className={className}
      >
        {children}
      </Link>
      <Tooltip label={action.label} />
    </span>
  );
}

export function FinanceDashboard() {
  const { data, cancelRegistration } = useSessionData();
  const [expandedRegistrationId, setExpandedRegistrationId] = useState<string | null>(null);

  const registrationItems = data.payables.map((item) => ({
    payable: item,
    registration: data.registrations.find(
      (registration) => registration.id === item.registrationId,
    ),
  }));

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
              <div className="hidden grid-cols-[2.25rem_minmax(0,1fr)_7.5rem_7rem_5.75rem] gap-3 px-1 text-xs font-semibold text-[var(--ink-subtle)] lg:grid">
                <span />
                <span>รายการ</span>
                <span className="text-right">ราคา</span>
                <span>สถานะ</span>
                <span className="text-right">จัดการ</span>
              </div>

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
                const status = paymentStatusInfo(payable.state);
                const canCancel = payable.state === "payment-required";

                return (
                  <article
                    key={payable.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-4 py-3"
                  >
                    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_5.75rem] gap-3 lg:grid-cols-[2.25rem_minmax(0,1fr)_7.5rem_7rem_5.75rem] lg:items-center">
                      <div className="flex h-9 items-center">
                        {expandable ? (
                          <IconButton
                            label={expanded ? "ซ่อนรายวิชา" : "แสดงรายวิชา"}
                            onClick={() =>
                              setExpandedRegistrationId(
                                expanded ? null : payable.registrationId,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            <ChevronDown
                              aria-hidden="true"
                              className={`h-4 w-4 transition ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </IconButton>
                        ) : (
                          <span className="h-9 w-9" aria-hidden="true" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-[var(--foreground)]">
                          {payable.name}
                        </p>
                        <p className="mt-1 text-xs text-[var(--ink-muted)]">
                          {isProgram ? "หลักสูตร" : "รายวิชา"} ·{" "}
                          {registration?.term ?? CURRENT_TERM}
                        </p>
                      </div>

                      <span className="col-start-2 font-mono text-sm font-semibold text-[var(--foreground)] lg:col-start-auto lg:text-right">
                        {formatTHB(payable.amount)}
                      </span>

                      <div className="col-start-2 flex items-center lg:col-start-auto">
                        <span
                          className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="col-start-3 row-start-1 flex h-9 w-[5.75rem] items-center justify-end gap-2 self-start lg:col-start-auto lg:row-start-auto lg:self-center">
                        {canCancel ? (
                          <IconButton
                            label="ยกเลิกรายการ"
                            onClick={() => cancelRegistration(payable.registrationId)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[var(--ink-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            <X aria-hidden="true" className="h-4 w-4" />
                          </IconButton>
                        ) : null}

                        {action ? (
                          <IconLink action={action}>
                            {action.icon === "receipt" ? (
                              <ReceiptText aria-hidden="true" className="h-4 w-4" />
                            ) : (
                              <Upload aria-hidden="true" className="h-4 w-4" />
                            )}
                          </IconLink>
                        ) : null}
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 overflow-hidden rounded-lg border border-[color:var(--border)] bg-[var(--surface)]">
                        <div className="grid grid-cols-[minmax(0,1fr)_6rem_7.5rem] gap-3 border-b border-[color:var(--border)] px-4 py-2 text-xs font-semibold text-[var(--ink-muted)]">
                          <span>รายวิชาที่เลือก</span>
                          <span className="text-right">หน่วยกิต</span>
                          <span className="text-right">ราคา</span>
                        </div>
                        <div className="divide-y divide-[color:var(--border)]">
                          {selectedSubjects.map((subject) => (
                            <div
                              key={subject.id}
                              className="grid grid-cols-[minmax(0,1fr)_6rem_7.5rem] items-center gap-3 px-4 py-2 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="line-clamp-1 font-medium text-[var(--foreground)]">
                                  {subject.name}
                                </p>
                                <p className="mt-0.5 text-[var(--ink-muted)]">
                                  {subject.code}
                                </p>
                              </div>
                              <span className="whitespace-nowrap text-right text-[var(--foreground)]">
                                {subject.credits} หน่วยกิต
                              </span>
                              <span className="justify-self-end whitespace-nowrap rounded-full bg-[var(--background)] px-2 py-1 text-right font-semibold text-[var(--primary)]">
                                {formatTHB(subject.price ?? 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
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
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              การดำเนินการ
            </h2>
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
            <div className="space-y-3">
              {historyPreview.map((entry) => {
                const status = paymentStatusInfo(entry.state);

                return (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-3 py-3"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-[var(--foreground)]">
                      {entry.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--ink-subtle)]">
                        {entry.date}
                      </span>
                      <span className="font-mono text-sm font-semibold text-[var(--foreground)]">
                        {formatTHB(entry.amount)}
                      </span>
                    </div>
                    <span
                      className={`mt-2 inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}

              <Link
                href="/profile/finance/documents"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[color:var(--border)] bg-[var(--background)] text-sm font-semibold text-[var(--foreground)] transition hover:border-[color:var(--ring)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
              >
                ดูเอกสารทั้งหมด
              </Link>
            </div>
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
